/**
 * @module routes
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var express = require('express');
var config = require('../../../config');
var bills = require('./bills');
var zipcode = require('./zipcode');
var legislators = require('./legislators');
var unauthorized = require('./unauthorized');
var categories = require('./categories');
var tags = require('./tags');
var settings = require('./settings');
var profile = require('./profile');
var apiUser = require('./user');
var token = require('./token');
var search = require('./search');

var API_VERSION = config.get('version');

var router = express.Router(config.router);

router.use('/' + API_VERSION + '/', bills);
router.use('/' + API_VERSION + '/', zipcode);
router.use('/' + API_VERSION + '/', legislators);
router.use('/' + API_VERSION + '/', unauthorized);
router.use('/' + API_VERSION + '/', categories);
router.use('/' + API_VERSION + '/', tags);
router.use('/' + API_VERSION + '/', settings);
router.use('/' + API_VERSION + '/', profile);
router.use('/' + API_VERSION + '/', apiUser);
router.use('/' + API_VERSION + '/', token);
router.use('/' + API_VERSION + '/', search);

module.exports = router;