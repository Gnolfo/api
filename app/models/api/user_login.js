var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

var UserLogin = db.dbApi.define('user_login', {
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
  user_agent: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ip_address: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  country: {
    type: 'CHAR(2)',
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  postal_code: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['country']
    }
  ]
});

UserLogin.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = UserLogin;
