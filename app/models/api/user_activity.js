var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

var UserActivity = db.dbApi.define('user_activity', {
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
  type: {
    type: DataTypes.ENUM(
      'changed_email',
      'changed_password',
      'changed_username',
      'closed_account',
      'comment_liked',
      'created_account',
      'downgraded_account',
      'followed_user',
      'left_comment',
      'liked_comment',
      'liked_project',
      'login',
      'logout',
      'received_comment',
      'reset_password',
      'upgraded_account',
      'user_followed'
    ),
    allowNull: false,
    defaultValue: 'login'
  },
  project_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true
  },
  follow_user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true
  },
  collection_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['type']
    }
  ]
});

UserActivity.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true,
  as: 'User',
  allowNull: false
});

UserActivity.belongsTo(User, {
  foreignKey: 'follow_user_id',
  targetKey: 'id',
  foreignKeyConstraint: true,
  as: 'Following',
  allowNull: true
});

User.hasMany(UserActivity, { foreignKey: 'user_id', allowNull: true });
User.hasMany(UserActivity, { foreignKey: 'follow_user_id', allowNull: true });

module.exports = UserActivity;
