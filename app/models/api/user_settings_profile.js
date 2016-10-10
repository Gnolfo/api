var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

var UserSettingProfile = db.dbApi.define('user_settings_profile', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['user_id'],
      unique: true
    }
  ]
});

UserSettingProfile.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = UserSettingProfile;
