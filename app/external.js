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

var cacheDirectory = path.join(__dirname, 'cache/');

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
            return fs.unlink(path.join(cacheDirectory, file), function(){
              return true;
            });
          }
        });
      });
    });
  },

  /**
   * Get External Content
   * @param {string} url - URL of Content to Fetch
   * @param {boolean} cache - Whether or not to cache results
   * @returns {bluebird|exports|module.exports}
   */
  getContent: function(url, cache) {
    var fileName = md5(url) + '.json';

    // @TODO: Figure out why caching is not working yet
    cache = false;

    var fetch = function() {
      return new Promise(function (resolve, reject) {
        var lib = url.startsWith('https') ? require('https') : require('http');
        var request = lib.get(url, function (response) {
          if (response.statusCode < 200 || response.statusCode > 299) {
            reject(new Error('Failed to load page, status code: ' + response.statusCode));
          }

          var body = [];

          response.on('data', function (chunk) { body.push(chunk); });
          response.on('end', function () {
            var content = body.join('');

            if (cache) {
              return fs.writeFile(path.join(cacheDirectory, fileName), content, function(err) {
                if (err) {
                  console.log('fetch error', err);
                  reject(err);
                } else {
                  console.log('fetch success');
                  resolve(content);
                }
              });
            } else {
              resolve(content);
            }
          });
        });

        request.on('error', function (err) { reject(err); });
      });
    };

    // check for cached URL
    if (cache) {
      return new Promise(function (resolve, reject) {
        fs.stat(path.join(cacheDirectory, fileName), function(err, stat) {
          var endTime, now;
          if (err) {
            return fetch();
          }

          now = new Date().getTime();
          endTime = new Date(stat.ctime).getTime() + 360000;

          if (now > endTime) {
            return fs.readFile(path.join(cacheDirectory, fileName), function(err, content){
              if (err) {
                reject(err);
              } else {
                resolve(content);
              }
            });
          } else {
            return fetch();
          }
        });
      });
    } else {
      return fetch();
    }
  }
};
