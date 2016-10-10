var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var Subscription = require('./subscriptions');
var User = require('./users');

var SubscriptionPayment = db.dbApi.define('subscription_payments', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  subscription_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  payment_type: {
    type: DataTypes.ENUM('monthly','annual'),
    allowNull: false,
    defaultValue: 'monthly'
  },
  payment_amount: {
    type: DataTypes.DECIMAL(8, 2).UNSIGNED,
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.fn('NOW')
  }
}, {
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['subscription_id']
    },
    {
      fields: ['payment_type']
    }
  ]
});

SubscriptionPayment.belongsTo(Subscription, {
  foreignKey: 'subscription_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

SubscriptionPayment.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = SubscriptionPayment;
