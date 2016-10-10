var express = require('express');
var debug = require('debug')('express:api');
var config = require('./config');
var routerApiV1 = require('./api/v1/routes/index');
var router = express.Router(config.get('router'));

router.use('/', routerApiV1);

module.exports = router;
