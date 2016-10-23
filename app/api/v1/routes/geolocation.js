/**
 * @module routes/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var router = express.Router(config.router);
var GeolocationDomain = require('../domain/geolocation');

/**
 * Bills
 * @memberof module:routes/geolocation
 * @name [GET] /geolocation
 */
/* istanbul ignore next */
router.route('/zipcode/:zipcode').get(function(request, response) {
  GeolocationDomain.getZipcode(request.params.zipcode)
    .then(function(results){
      console.log(results);
      response.json(util.createAPIResponse({
        error: false,
        data: results.data
      }));
    });
});

module.exports = router;
