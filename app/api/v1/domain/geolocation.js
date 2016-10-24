/**
 * @module domain/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var validator = require('validator');
var util = require('./util');
var config = require('../../../config');
var elasticsearchClient = require('../../../elasticsearch/client');
var env = config.get('env');
var indexType = env + '_geolocation';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

var DEFAULT_PAGE_SIZE = 30;

/**
 * Geolocation
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput: function(data) {
    var fields = [
      'type',
      'city',
      'state',
      'zipcode',
      'county',
      'country',
      'timezone',
      'location',
      'area_codes',
      'alternate_city_names',
      'estimated_population'
    ];

    return _.pick(data._source, fields);
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @param {object} data.id - Tag ID
   * @param {object} data.name - Tag Name
   * @param {object} data.slug - Tag Slug
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    return {
      id: data.id,
      type: data.type.toLowerCase(),
      city: data.primary_city,
      state: data.state,
      zipcode: data.zipcode,
      country: data.country,
      alternate_city_names: data.acceptable_cities.split(', '),
      area_codes: data.area_codes.split(','),
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      decommissioned: data.decommissioned,
      county: data.county,
      world_region: data.world_region,
      estimated_population: data.estimated_population,
      location: {
        lat: data.latitude,
        lon: data.longitude
      }
    };
  },

  /**
   *
   * @param {string} zipcode
   * @param {object} query
   * @returns {*}
   */
  getZipcode: function (zipcode, query) {

    var self = this;
    var searchParams = {
      index: indexName,
      body: {
        query: {
          match: {
            zipcode: zipcode
          }
        }
      }
    };

    return elasticsearchClient.search(searchParams)
      .then(function(result) {
        var data = result.hits.hits.map(self.prepareForAPIOutput);
        return {
          error: false,
          errors: null,
          data: data
        };
      })
      .catch(function(error) {
        return {
          error: true,
          errors: error,
          data: null
        };
      });
  },

  /**
   * Get Location
   * @param {object} query - GET Parameters
   * @returns {*}
   */
  getLocation: function (query) {

    // Defaults
    var andFilters;
    var pageSize = DEFAULT_PAGE_SIZE;
    var page = 1;
    var self = this;
    var searchParams = {
      index: indexName,
      type: indexType,
      sort: 'zipcode',
      body: {}
    };

    function getAndFilters() {
      if (!_.get(searchParams, 'body.query.bool.must')) {
        _.set(searchParams, 'body.query.bool.must', []);
      }

      return _.get(searchParams, 'body.query.bool.must');
    }

    // Page size
    if (query.pageSize && validator.isInt(query.pageSize) && validator.toInt(query.pageSize, 10) >= 1) {
      pageSize = validator.toInt(query.pageSize, 10);
    }

    searchParams.size = pageSize;

    // Determine Page
    if (query.page && validator.isInt(query.page) && validator.toInt(query.page, 10) >= 1) {
      page = validator.toInt(query.page, 10);
    }

    searchParams.from = (page - 1) * searchParams.size;

    /**
     * Filter By Unique Zip Code
     */
    if (query.zipcode) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          zipcode: query.zipcode
        }
      });
    }

    /**
     * Filter By City
     */
    if (query.city) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          city: query.city.toLowerCase()
        }
      });

      andFilters.push({
        match: {
          alternate_city_names: query.city.toLowerCase()
        }
      });
    }

    /**
     * Filter By County
     */
    if (query.county) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          county: query.county.toLowerCase()
        }
      });
    }

    /**
     * Filter By State
     */
    if (query.state) {
      andFilters = getAndFilters();
      andFilters.push({
        term: {
          state: query.state.toLowerCase()
        }
      });
    }

    /**
     * Filter By Type
     */
    if (query.type) {
      andFilters = getAndFilters();
      andFilters.push({
        term: {
          type: query.type.toLowerCase()
        }
      });
    }

    /**
     * Filter By Area Code
     */
    if (query.areaCode) {
      andFilters = getAndFilters();
      andFilters.push({
        term: {
          area_codes: query.areaCode
        }
      });
    }

    /**
     * Filter By Time Zone
     */
    if (query.timezone) {
      andFilters = getAndFilters();
      andFilters.push({
        term: {
          timezone: query.timezone.toLowerCase()
        }
      });
    }

    /**
     * Filter By Minimum Population
     */
    if (query.minPopulation) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          estimated_population: {
            gte: parseInt(query.minPopulation, 0)
          }
        }
      });
    }

    /**
     * Filter By Maximum Population
     */
    if (query.maxPopulation) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          estimated_population: {
            lte: parseInt(query.maxPopulation, 0)
          }
        }
      });
    }

    /**
     * Filter By Latitude, Longitude & Distance
     */
    if (query.latitude && query.longitude) {
      var DEFAULT_DISTANCE = '5mi';

      getAndFilters();
      searchParams.body.query.bool.filter = {
        geo_distance : {
          distance : query.distance || DEFAULT_DISTANCE,
          location : {
            lat: parseFloat(query.latitude),
            lon: parseFloat(query.longitude)
          }
        }
      };
    }

    return elasticsearchClient.search(searchParams)
      .then(function(result) {
        return {
          meta: {
            total: result.hits.total,
            showing: result.hits.hits.length,
            pages: Math.ceil(result.hits.total / searchParams.size),
            page: page
          },
          data: result.hits.hits.map(self.prepareForAPIOutput)
        };
      })
      .catch(function(error) {
        return util.createAPIResponse({
          error: true,
          errors: error
        });
      });
  }
};
