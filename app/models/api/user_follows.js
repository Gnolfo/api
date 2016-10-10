var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

var UserFollow = db.dbApi.define('user_follows', {
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
  follow_user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['user_id', 'follow_user_id'],
      unique: true
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['follow_user_id']
    }
  ]
});

UserFollow.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true,
  as: 'Follower'
});

UserFollow.belongsTo(User, {
  foreignKey: 'follow_user_id',
  targetKey: 'id',
  foreignKeyConstraint: true,
  as: 'Following'
});

module.exports = UserFollow;
