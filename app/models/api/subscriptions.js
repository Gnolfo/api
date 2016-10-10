var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var SubscriptionType = require('./subscription_types');
var User = require('./users');

var Subscription = db.dbApi.define('subscriptions', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  subscription_type_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  stripe_customer_id: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  stripe_payment_source_id: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('monthly','annual'),
    allowNull: false,
    defaultValue: 'monthly'
  },
  status: {
    type: DataTypes.ENUM('active','cancelled','suspended'),
    allowNull: false,
    defaultValue: 'active'
  },
  suspended_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  suspended_reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false
  },
  last_payment: {
    type: DataTypes.DATE,
    allowNull: false
  },
  auto_renew: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: '1'
  }
}, {
  indexes: [
    {
      fields: ['user_id'],
      unique: true
    },
    {
      fields: ['stripe_customer_id'],
      unique: true
    },
    {
      fields: ['stripe_payment_source_id'],
      unique: true
    },
    {
      fields: ['type']
    },
    {
      fields: ['auto_renew']
    },
    {
      fields: ['subscription_type_id']
    },
    {
      fields: ['status']
    }
  ]
});

Subscription.belongsTo(SubscriptionType, {
  foreignKey: 'subscription_type_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

Subscription.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = Subscription;
