var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var SubscriptionType = db.dbApi.define('subscription_types', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('enabled','disabled'),
    allowNull: false,
    defaultValue: 'disabled'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  monthly_rate: {
    type: DataTypes.DECIMAL(8, 2).UNSIGNED,
    allowNull: false
  },
  annual_rate: {
    type: DataTypes.DECIMAL(8, 2).UNSIGNED,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['name'],
      unique: true
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = SubscriptionType;
