var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var Group = db.dbApi.define('groups', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['name'],
      unique: true
    },
    {
      fields: ['slug'],
      unique: true
    }
  ]
});

module.exports = Group;
