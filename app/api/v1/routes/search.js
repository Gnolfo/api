var express = require('express');
var config = require('../../../config');
var search = require('../domain/search');
var util = require('./util');
var router = express.Router(config.router);

router.route('/search').get(function(request, response) {
  search.users(request.query)
    .then(function(users) {
      response.json(util.createAPIResponse({
        data: users
      }));
    })
    .catch(function(errors) {
      response.status(400);
      response.json(util.createAPIResponse({
        error: true,
        errors: [errors.toString()]
      }));
    });
});

router.route('/search/user').get(function(request, response) {
  search.users(request.query)
    .then(function(users) {
      response.json(util.createAPIResponse({
        data: users
      }));
    })
    .catch(function(errors) {
      response.status(400);
      response.json(util.createAPIResponse({
        error: true,
        errors: [errors.toString()]
      }));
    });
});

module.exports = router;
