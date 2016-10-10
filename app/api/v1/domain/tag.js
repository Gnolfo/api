var _ = require('lodash');

var Tag = {
  prepareForAPIOutput: function(data) {
    var fields = ['id', 'name', 'slug'];
    return _.pick(data._source, fields);
  },
  prepareForElasticSearch: function(data) {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug
    };
  }
};

module.exports = Tag;
