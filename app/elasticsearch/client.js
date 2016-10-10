var config = require('../config');
var elasticsearch = require('elasticsearch');

module.exports = new elasticsearch.Client({
  host: config.get('elasticsearch.host'),
  apiVersion: '1.7',
  requestTimeout: 60000
});
