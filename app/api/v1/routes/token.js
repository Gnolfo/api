/**
 * @module routes/token
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var router = express.Router(config.router);
var auth = require('../domain/users/auth');

/**
 * Token
 * @memberof module:routes/token
 * @name [GET] /token
 */
router.route('/token').get(function(request, response) {

  var ipAddress = request.headers['x-forwarded-for'];
  var token = auth.createWebsiteToken(ipAddress);
  response.json(util.createAPIResponse({
    error: false,
    data: {
      token: token
    }
  }));
});

module.exports = router;
