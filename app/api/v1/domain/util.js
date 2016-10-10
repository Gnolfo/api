var _ = require('lodash');
var slug = require('slug');

/**
 * Doing domain utilities
 * @type {Object}
 */
module.exports = {
  /**
   * Slugify method stolen from Sequelize Slugify module
   * @param  {object} data        Data object with slug source data
   * @param  {object} slugOptions Slug options, should have `source` key as
   *                              an array of field to use for source for slug
   * @return {string}
   */
  slugify: function (data, slugOptions){
    var slugParts = _.map(slugOptions.source, function(slugSourceField) {
      return data[slugSourceField];
    });
    return slug(slugParts.join(' '), {lower: true});
  },

  /**
   * Takes a string of comma-separated numbers, e.g. "1,5,7",
   * splits by comma and returns an array of integers, pruning
   * out anything that's not an integer
   * @param  {string} str Comma-separated numbers
   * @return {array}
   */
  normalizeCommaSeparatedIntegers: function(str) {
    var ints = _.compact(_.map(str.split(','), function(raw) {
      var num = parseInt(_.trim(raw), 10);
      if (_.isNumber(num)) {
        return num;
      } else {
        return null;
      }
    }));
    return ints && ints.length ? ints : null;
  }
};
