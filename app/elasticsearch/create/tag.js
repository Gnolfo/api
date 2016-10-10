var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_tag';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

var mapping = {
  index: indexName,
  type: indexType,
  body: {}
};

mapping.body[indexType] = {
  properties: {
    name: {
      type: 'string'
    },
    slug: {
      type: 'string'
    }
  }
};

var Tag = client.indices.create({
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

module.exports = Tag;
