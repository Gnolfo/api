/**
 * @module models/campaignzero
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

/**
 * Campaign Zero
 * @type {object}
 */
module.exports = {
  Bills: require('./bills'),
  PoliceKillings: require('./police_killings'),
  ZipCode: require('./zipcode')
};