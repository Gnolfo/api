var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var Group = require('./groups');
var User = require('./users');

var UserGroup = db.dbApi.define('user_group', {
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
  group_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['user_id', 'group_id'],
      unique: true
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['group_id']
    }
  ]
});

UserGroup.belongsTo(Group, {
  foreignKey: 'group_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

UserGroup.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = UserGroup;
