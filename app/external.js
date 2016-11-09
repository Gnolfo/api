/**
 * @module external
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var path = require('path');
var fs = require('fs');
var md5 = require('md5');
var request = require('request');
var Promise = require('bluebird');

var config = require('./config');

var redis = require('redis');
var redisClient = redis.createClient(config.get('redis.port'), config.get('redis.host'));
var redisCacheExpires = config.get('redis.cacheExpire');

if (config.get('redis.password')) {
  redisClient.auth(config.get('redis.password'));
}



module.exports = {
  /**
   * Get External Content
   * @param {string} url - URL of Content to Fetch
   * @param {boolean} cache - Whether or not to cache results
   * @returns {bluebird|exports|module.exports}
   */
  getContent: function(url, cache) {
    var cacheKey = md5(url);

    return new Promise(function (resolve, reject) {
      if (cache) {
        redisClient.get(cacheKey, function (err, result) {
          if (!err && result) {
            console.log('USING REDIS CACHE: ', cacheKey);
            resolve(result);
          }
        });
      }

      var lib = url.startsWith('https') ? require('https') : require('http');
      var request = lib.get(url, function (response) {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load page, status code: ' + response.statusCode));
        }

        var body = [];

        response.on('data', function (chunk) { body.push(chunk); });
        response.on('end', function () {
          var content = body.join('');

          if (typeof content === 'object') {
            content = JSON.stringify(content);
          }

          if (cache) {
            redisClient.setex(cacheKey, redisCacheExpires, content);
          }

          resolve(content);
        });
      });

      request.on('error', function (err) { reject(err); });
    });
  }
};
