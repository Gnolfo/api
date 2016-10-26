/**
 * @module routes/util
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var request = require('request');
var config = require('../../../config');
var Activity = require('../../../models/api/user_activity');
var Login = require('../../../models/api/user_login');
var jwt = require('jsonwebtoken');

/* istanbul ignore next */
module.exports = {

  /**
   * Default Response Template
   */
  defaultResponse: {
    error: false,
    errors: [],
    field_errors: {},
    meta: {
      total: 0,
      showing: 0,
      pages: 1,
      page: 1
    },
    data: []
  },

  /**
   * Extend `defaultResponse` with the passed in object, pass the result into `response.json()`
   * @param  {object} data - Data object to fill response with
   * @return {object}
   */
  createAPIResponse: function(data) {
    var response = _.merge({}, this.defaultResponse, data);

    var errors = _.map(response.field_errors, function(value, key) {
      return _.isArray(value) && value.length > 0;
    });

    errors.push(response.errors.length > 0);

    response.error = _.some(errors, Boolean);

    // Sort Data if a single object
    if (data && !_.isArray(data.data) && _.isObject(data.data)){

      var sortedData = {};
      Object.keys(data.data).sort().forEach(function(key) {
        sortedData[key] = data.data[key];
      });

      response.data = sortedData;
    }

    // Auto populate meta data if not was sent over
    if(data && !data.meta) {

      var total = 1;

      if(_.isEmpty(data.data)){
        total = 0;
      } else if(_.isArray(data.data)) {
        total = data.data.length;
      }

      response.meta.total = total;
      response.meta.showing = total;
      response.meta.pages = 1;
      response.meta.page = 1;
    }

    return response;
  },

  /**
   * Make Remote HTTP call to {@link http://ipinfodb.com/ip_location_api.php} API to convert IP Address to Geoocation
   * @param {string} ip - IP Address
   * @param {callback} callback - Requested Callback Handler
   */
  getGeoLocation: function(ip, callback){

    var params = {
      key: config.get('ipinfodb.key'),
      ip: ip,
      format: 'json'
    };

    request.get({ url: 'https://api.ipinfodb.com/v3/ip-city/', qs: params }, function(error, response, geolocation){
      if(geolocation && typeof geolocation === 'string'){
        callback(JSON.parse(geolocation));
      } else {
        callback({
          statusCode: 'OK',
          statusMessage: '',
          ipAddress: ip,
          countryCode: null,
          countryName: null,
          regionName: null,
          cityName: null,
          zipCode: null,
          latitude: null,
          longitude: null,
          timeZone: null
        });
      }
    });
  },

  /**
   * Track User Login
   * @param {object} user - User Object
   * @param {object} request - Node HTTP Request
   */
  trackLogin: function(user, request){

    var ipAddress = request.headers['x-forwarded-for'];
    var userAgent = request.headers['user-agent'];

    this.getGeoLocation(ipAddress, function(geolocation){
      if(geolocation){
        Login.create({
          user_id: user.get('id'),
          user_agent: userAgent,
          ip_address: geolocation.ipAddress,
          country: geolocation.countryCode,
          city: geolocation.cityName,
          state: geolocation.regionName,
          postal_code: geolocation.zipCode,
          latitude: geolocation.latitude,
          longitude: geolocation.longitude
        });
      }
    });
  },

  /**
   * Track User Activity
   * @param {number} user_id - Logged In User ID
   * @param {string} type - Type of User Activity
   * @param {object} data - Data to Track
   * @param {callback} callback - Requested Callback Handler
   * @returns {*}
   */
  trackActivity: function(user_id, type, data, callback){
    if(user_id && type){

      var log = {
        user_id: user_id,
        type: type
      };

      if(data && data.follow_user_id){
        log.follow_user_id = data.follow_user_id;
      }

      Activity.create(log);
    }

    if(typeof callback === 'function'){
      return callback();
    }
  },

  /**
   * Check if User is Valid
   * @param {object} request - HTTP Request
   * @param {callback} callback - Requested Callback Handler
   * @returns {*}
   */
  isValidUser: function(request, callback){

    var headerToken = (request.headers.authorization) ? request.headers.authorization.replace('Bearer ', '') : null;

    if(headerToken && headerToken !== null) {
      jwt.verify(headerToken, config.get('secret'), function(err, decoded){
        if(decoded.userId){
          return callback(parseInt(decoded.userId, 10));
        } else {
          return callback(false);
        }
      });
    } else {
      return callback(false);
    }
  }
};
