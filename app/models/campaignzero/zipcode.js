/**
 * @module models/campaignzero/zipcode
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * Zip Codes
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} zipcode - LABEL
 * @property {string} type - LABEL
 * @property {string} decommissioned - LABEL
 * @property {string} primary_city - LABEL
 * @property {string} acceptable_cities - LABEL
 * @property {string} unacceptable_cities - LABEL
 * @property {string} state - LABEL
 * @property {string} county - LABEL
 * @property {string} timezone - LABEL
 * @property {string} area_codes - LABEL
 * @property {string} world_region - LABEL
 * @property {string} country - LABEL
 * @property {string} latitude - LABEL
 * @property {string} longitude - LABEL
 * @property {string} estimated_population - LABEL
 */
var ZipCode = db.dbApi.define('zipcode', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  zipcode: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('UNIQUE','PO BOX','STANDARD','MILITARY'),
    allowNull: false,
    defaultValue: 'STANDARD'
  },
  decommissioned: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  primary_city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  acceptable_cities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  unacceptable_cities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  county: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  timezone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  area_codes: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  world_region: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT(14),
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT(14),
    allowNull: false
  },
  estimated_population: {
    type: DataTypes.INTEGER(10),
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['zipcode'],
      unique: true
    }
  ]
});

module.exports = ZipCode;
