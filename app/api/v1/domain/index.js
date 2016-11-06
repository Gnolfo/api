/**
 * @module domain
 * @version 1.0.0
 */

/**
 * Domain
 * @type {object}
 */
module.exports = {
  Bills: require('./bills'),
  Category: require('./category'),
  Email: require('./email'),
  Geolocation: require('./geolocation'),
  Profile: require('./profile'),
  PoliceKillings: require('./police_killings'),
  Search: require('./search'),
  Settings: require('./settings'),
  Tag: require('./tag'),
  User: require('./user'),
  Util: require('./util')
};
