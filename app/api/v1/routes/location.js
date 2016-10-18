/**
 * @module routes/location
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var http = require('http');
var router = express.Router(config.router);

/**
 * Location
 * @memberof module:routes/location
 * @name [GET] /location
 */
/* istanbul ignore next */
router.route('/location').get(function(request, response) {
  var options = {
    host: '',
    path: ''
  };

  var callback = function(data) {
    var results = '';

    //another chunk of data has been recieved, so append it to `str`
    data.on('data', function (chunk) {
      results += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    data.on('end', function () {
      var json = JSON.parse(results);

      if (json && json[0] === 'Bad Request') {
        response.json(util.createAPIResponse({
          error: true,
          errors: json
        }));
      } else {
        response.json(util.createAPIResponse({
          error: false,
          data: json
        }));
      }
    });
  };

  http.request(options, callback).end();
});

module.exports = router;
