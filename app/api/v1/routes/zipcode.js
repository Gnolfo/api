/**
 * @module routes/zipcode
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var router = express.Router(config.router);

/**
 * Bills
 * @memberof module:routes/zipcode
 * @name [GET] /zipcode
 */
/* istanbul ignore next */
router.route('/zipcode').get(function(request, response) {
  response.json(util.createAPIResponse({
    error: false,
    data: []
  }));
});

module.exports = router;
