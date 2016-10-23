/**
 * @module domain/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var util = require('./util');
var config = require('../../../config');
var elasticsearchClient = require('../../../elasticsearch/client');
var env = config.get('env');
var indexType = env + '_geolocation';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

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
      'country',
      'timezone',
      'location',
      'area_codes',
      'alternate_city_names'
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
      area_codes: data.area_codes.split(', '),
      latitude: data.latitude,
      longitude: data.longitude,
      location: {
        latitude: data.latitude,
        longitude: data.longitude
      },
      timezone: data.timezone,
      decommissioned: data.decommissioned,
      county: data.county,
      world_region: data.world_region,
      estimated_population: data.estimated_population
    };
  },

  /**
   id
   zipcode
   type
   decommissioned
   primary_city
   acceptable_cities
   unacceptable_cities
   state
   county
   timezone
   area_codes
   world_region
   country
   latitude
   longitude
   estimated_population
   */

  getZipcode: function (zipcode) {

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
  }
};
