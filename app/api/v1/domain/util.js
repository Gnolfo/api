/**
 * @module domain/util
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');

/**
 * Doing domain utilities
 * @type {Object}
 */
module.exports = {
  /**
   * Takes a string of comma-separated numbers, e.g. "1,5,7", splits by comma and returns an array of integers, pruning out anything that's not an integer
   * @param  {string} str Comma-separated numbers
   * @return {array}
   */
  normalizeCommaSeparatedIntegers: function(str) {
    var ints = _.compact(_.map(str.split(','), function(raw) {
      var num = parseInt(_.trim(raw), 10);
      /* istanbul ignore else */
      if (_.isNumber(num)) {
        return num;
      } else {
        return null;
      }
    }));

    return ints && ints.length ? ints : null;
  },

  /**
   * Get External Content
   * @param url
   * @returns {bluebird|exports|module.exports}
   */
  getContent: function(url) {
    return new Promise(function (resolve, reject) {
      var lib = url.startsWith('https') ? require('https') : require('http');
      var request = lib.get(url, function (response) {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load page, status code: ' + response.statusCode));
        }

        var body = [];

        response.on('data', function (chunk) { body.push(chunk); });
        response.on('end', function () { resolve(body.join('')); });
      });

      request.on('error', function (err) { reject(err); });
    });
  },

  /**
   * Build URL
   * @param {string} domain - Base of URL, eg: http://mywebsite.com
   * @param {object} params - Object of Key Value Pairs
   * @returns {{domain: *, url: string, query: string}}
   */
  buildUrl: function (domain, params) {
    var getParams = [];

    for(var key in params) {
      if (params.hasOwnProperty(key)) {
        getParams.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[ key ]));
      }
    }

    return {
      domain: domain,
      url: (getParams.length > 0) ? (domain + '?' + getParams.join('&')) : domain,
      query: (getParams.length > 0) ? ('?' + getParams.join('&')) : ''
    };
  }
};
