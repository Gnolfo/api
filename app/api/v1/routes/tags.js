var express = require('express');
var validator = require('validator');
var _ = require('lodash');
var config = require('../../../config');
var elasticsearchClient = require('../../../elasticsearch/client');
var domain = require('../domain');
var util = require('./util');
var router = express.Router(config.router);

var DEFAULT_PAGE_SIZE = 30;

var env = config.get('env');
var indexType = env + '_tag';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

router.route('/tags').get(function(request, response) {

  // Defaults
  var pageSize = DEFAULT_PAGE_SIZE;
  var page = 1;

  var searchParams = {
    index: indexName,
    sort: 'id',
    body: {}
  };

  // Page size
  if (request.query.pageSize && validator.isInt(request.query.pageSize) && validator.toInt(request.query.pageSize, 10) >= 1) {
    pageSize = validator.toInt(request.query.pageSize, 10);
  }

  searchParams.size = pageSize;

  // Determine Page
  if (request.query.page && validator.isInt(request.query.page) && validator.toInt(request.query.page, 10) >= 1) {
    page = validator.toInt(request.query.page, 10);
  }

  searchParams.from = (page - 1) * searchParams.size;

  elasticsearchClient
    .search(searchParams)
    .then(function(result) {
      response.json(util.createAPIResponse({
        meta: {
          total: result.hits.total,
          showing: result.hits.hits.length,
          pages: Math.ceil(result.hits.total/searchParams.size),
          page: page
        },
        data: result.hits.hits.map(domain.Tag.prepareForAPIOutput)
      }));
    })
    .catch(function(error) {
      response.json(util.createAPIResponse({
        errors: [error]
      }));
    });
});

module.exports = router;
