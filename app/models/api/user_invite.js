var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

var UserInvite = db.dbApi.define('user_invite', {
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
  new_user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['user_id', 'new_user_id'],
      unique: true
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['new_user_id']
    }
  ]
});

UserInvite.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true,
  as: 'User'
});

UserInvite.belongsTo(User, {
  foreignKey: 'new_user_id',
  targetKey: 'id',
  foreignKeyConstraint: true,
  as: 'Invited'
});

module.exports = UserInvite;
