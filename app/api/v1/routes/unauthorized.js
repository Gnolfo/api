var express = require('express');
var config = require('../../../config');
var util = require('./util');
var router = express.Router(config.router);

router.route('/unauthorized/').get(function(request, response) {
  response.json(util.createAPIResponse({
    error: true,
    error_messages: [
      'Invalid API Request. Either your API Key is invalid, or you are accessing our API from an invalid source.'
    ]
  }));
});

module.exports = router;
