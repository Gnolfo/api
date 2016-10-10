var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_category';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

var mapping = {
  index: indexName,
  type: indexType,
  body: {}
};

mapping.body[indexType] = {
  properties: {
    id: {
      type: 'integer'
    },
    parent_id: {
      type: 'integer'
    },
    name: {
      type: 'string'
    },
    slug: {
      type: 'string'
    }
  }
};

var Category = client.indices.create({
  index: indexName
})
.then(function() {
  client.indices
    .putMapping(mapping)
    .then(function() {
      debug.success('Index Created: ' + indexName);
    })
    .catch(function(error) {
      debug.error('Error applying ' + indexType + ' mapping');
      debug.error(error.status + ' ' + error.message);
    });
})
.catch(function(error) {
  debug.error('There was an error creating the ' + indexType + ' index');
  debug.error(error.status + ' ' + error.message);
});

module.exports = Category;
