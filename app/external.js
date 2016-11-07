/**
 * @module external
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var request = require('request');
var Promise = require('bluebird');

var cachedRequest = require('cached-request')(request);
var cacheDirectory = path.join(__dirname, 'cache/');

cachedRequest.setCacheDirectory(cacheDirectory);

module.exports = {
  /**
   * Remove Old Files
   */
  cleanCache: function () {
    fs.readdir(cacheDirectory, function(err, files) {
      files.forEach(function(file) {
        if (file === '.gitignore') {
          return false;
        }

        fs.stat(path.join(cacheDirectory, file), function(err, stat) {
          var endTime, now;
          if (err) {
            return false;
          }

          now = new Date().getTime();
          endTime = new Date(stat.ctime).getTime() + 360000;

          if (now > endTime) {
            return rimraf(path.join(cacheDirectory, file), function () {
              return true;
            });
          }
        });
      });
    });
  },

  /**
   * Get External Content
   * @param url
   * @returns {bluebird|exports|module.exports}
   */
  getContent: function(url) {

    var requestOptions = {
      ttl: 360000, // 1 hour
      url: url
    };

    return new Promise(function (resolve, reject) {
      cachedRequest(requestOptions, function(error, resp, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }
};
