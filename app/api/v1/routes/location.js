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
    host: 'openstates.org',
    path: '/api/v1/legislators/geo/?lat=33701&long=&apikey=' + config.get('openStates.key')
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);
    });
  };

  http.request(options, callback).end();

  response.json(util.createAPIResponse({
    error: false,
    data: []
  }));
});

module.exports = router;
