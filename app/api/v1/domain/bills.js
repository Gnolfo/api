/**
 * @module domain/bills
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var validator = require('validator');
var Promise = require('bluebird');

var util = require('./util');
var Bills = require('../../../models/campaignzero/bills');

var DEFAULT_PAGE_SIZE = 30;

/**
 * Bills
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput: function(data) {
    var results = [];
    var fields = ['status', 'progress', 'chamber', 'state', 'city', 'bill_id', 'session_id', 'short_description', 'long_description', 'details_url'];

    for (var i = 0; i < data.length; i++) {
      results.push(_.pick(data[i].dataValues, fields));
    }

    return results;
  },

  /**
   * Sarch Bills
   * @param request
   * @property {enum} [status] - Status of Bill ['considering','passed','failed']
   * @property {enum} [progress] - Whether this bill passing is Good or Bad ['good','bad']
   * @property {enum} [chamber] - Which Chamber of Congress this bill is for ['upper','lower']
   * @property {string} [state] - Two Letter US State Code Abbreviation ( ISO 3166 )
   * @property {string} [city] - Specific City this Bill Belongs to
   * @property {string} [billId] - Unique Bill ID from Open States
   * @property {string} [sessionId] - Unique Session ID from Open States
   * @property {string} [beforeDate] - Filter by Bills Created Before or On this Date
   * @property {string} [afterDate] - Filter by Bills Created After or On this Date
   * @returns {object}
   */
  searchBills: function (request) {

    var pageSize = DEFAULT_PAGE_SIZE;
    var page = 1;
    var offset = 0;
    var i = 0;

    // Page size
    if (request.pageSize && validator.isInt(request.pageSize) && validator.toInt(request.pageSize, 10) >= 1) {
      pageSize = validator.toInt(request.pageSize, 10);
    }

    // Determine Page
    if (request.page && validator.isInt(request.page) && validator.toInt(request.page, 10) >= 1) {
      page = validator.toInt(request.page, 10);
    }

    offset = (page - 1) * pageSize;

    var searchParams = {
      published: {
        $eq: true
      }
    };

    /**
     * Filter by Status
     */
    if (request.status) {
      searchParams.status = {
        $eq: request.status
      };
    }

    /**
     * Filter by Progress
     */
    if (request.progress) {
      searchParams.progress = {
        $eq: request.progress
      };
    }

    /**
     * Filter by Chamber
     */
    if (request.chamber) {
      searchParams.chamber = {
        $eq: request.chamber
      };
    }

    /**
     * Filter by State
     */
    if (request.state) {
      searchParams.state = {
        $eq: request.state
      };
    }

    /**
     * Filter by City
     */
    if (request.city) {
      searchParams.city = {
        $like: request.city
      };
    }

    /**
     * Filter by Bills, using $and lookup since these can be typed a bunch of ways
     */
    if (request.billId) {
      var lookup_bill = request.billId.match(/[a-zA-Z]+|[0-9]+/g);

      searchParams.bill_id = {
        $and: []
      };

      for (i = 0; i < lookup_bill.length; i++) {
        searchParams.bill_id.$and.push({
          $like: '%' + lookup_bill[i] + '%'
        });
      }
    }

    /**
     * Filter by Session ID, using $and lookup since these can be typed a bunch of ways
     */
    if (request.sessionId) {
      var lookup_session = request.sessionId.match(/[a-zA-Z]+|[0-9]+/g);

      searchParams.session_id = {
        $and: []
      };

      for (i = 0; i < lookup_session.length; i++) {
        searchParams.session_id.$and.push({
          $like: '%' + lookup_session[i] + '%'
        });
      }
    }

    /**
     * Filter by Bills Created Before this Date
     */
    if (request.beforeDate) {
      searchParams.modified_date = {
        $lte: request.beforeDate
      };
    }

    /**
     * Filter by Bills Created Before this Date
     */
    if (request.afterDate) {
      searchParams.modified_date = {
        $gte: request.afterDate
      };
    }

    return Bills.findAndCountAll({
        limit: pageSize,
        offset: offset,
        where: searchParams
      })
      .then(function(data) {
        data.meta = {
          total: data.count,
          showing: data.rows.length,
          pages: Math.ceil(data.count / pageSize),
          page: page
        };

        return Promise.resolve(data);
      });
  }
};
