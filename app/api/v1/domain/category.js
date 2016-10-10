var _ = require('lodash');

var Category = {
  prepareForAPIOutput: function(data) {
    var fields = ['id', 'parent_id', 'name', 'slug'];
    var prepared = _.pick(data._source, fields);

    if (data._source.subcategories) {
      prepared.subcategories = _.sortBy(_.map(data._source.subcategories, function(subcat) {
        return _.pick(subcat, fields);
      }), 'name');
    }

    return prepared;
  },
  prepareForElasticSearch: function(data) {

    var prepData = {
      id: data.id,
      parent_id: data.parent_id,
      name: data.name,
      slug: data.slug,
      subcategories: []
    };

    for(var i = 0; i < data.subcategories.length; i++){
      prepData.subcategories.push({
        id: data.subcategories[i].id,
        parent_id: data.subcategories[i].parent_id,
        name: data.subcategories[i].name,
        slug: data.subcategories[i].slug
      });
    }

    return prepData;
  }
};


module.exports = Category;
