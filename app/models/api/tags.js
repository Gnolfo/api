var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var Tag = db.dbApi.define('tags', {
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

module.exports = Tag;
