var config = require('../../config');
var client = require('./../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_tag';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

var Tag = client.indices.delete({
  index: indexName
})
.then(function() {
  debug.success('Index Deleted: ' + indexName);
})
.catch(function(error) {
  debug.error(error.status + ' ' + error.message);
});

module.exports = Tag;
