var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

var ApiAuthentication = db.dbApi.define('api_authentication', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true
  },
  approved_whitelist: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'localhost'
  },
  api_key: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  api_secret: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  allow_api_get: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: '0'
  },
  allow_api_post: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: '0'
  },
  allow_api_put: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: '0'
  },
  allow_api_delete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: '0'
  },
  allow_content_management: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: '0'
  },
  allow_user_registration: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: '0'
  },
  app_name: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  app_type: {
    type: DataTypes.ENUM('web_app','mobile_app','os_app','tv_app','custom_app','developer'),
    allowNull: false,
    defaultValue: 'developer'
  },
  app_purpose: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  app_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  daily_limit: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: '1000'
  },
  status: {
    type: DataTypes.ENUM('pending_approval','approved','rejected','developer_terminated','deleted'),
    allowNull: false,
    defaultValue: 'pending_approval'
  },
  expire_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['api_key'],
      unique: true
    },
    {
      fields: ['allow_api_get']
    },
    {
      fields: ['allow_api_post']
    },
    {
      fields: ['allow_api_put']
    },
    {
      fields: ['allow_api_delete']
    },
    {
      fields: ['allow_content_management']
    },
    {
      fields: ['allow_user_registration']
    },
    {
      fields: ['status']
    },
    {
      fields: ['app_type']
    },
    {
      fields: ['user_id']
    }
  ]
});

ApiAuthentication.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = ApiAuthentication;
