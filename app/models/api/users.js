var _ = require('lodash');
var DataTypes = require('sequelize');
var db = require('../../config/sequelize');
var config = require('../../config');
var Hashids = require('hashids');
var hashID = new Hashids(config.get('hashID.secret'), config.get('hashID.length'), config.get('hashID.alphabet'));

var User = db.dbApi.define('users', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  activated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  company_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_photo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  profile_link_website: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link_twitter: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link_1: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link_2: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link_3: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  bio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  banned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  banned_reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  new_password: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  new_password_key: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  new_password_requested: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.fn('NOW')
  },
  new_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  new_email_key: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  new_email_requested: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.fn('NOW')
  }
}, {
  indexes: [
    {
      fields: ['username'],
      unique: true
    },
    {
      fields: ['email'],
      unique: true
    },
    {
      fields: ['new_email'],
      unique: true
    },
    {
      fields: ['new_password_key'],
      unique: true
    },
    {
      fields: ['new_email_key'],
      unique: true
    },
    {
      fields: ['activated']
    },
    {
      fields: ['banned']
    }
  ],
  instanceMethods: {

    publicJSON: function() {
      var exclude = [
        'new_email',
        'new_email_key',
        'new_email_requested',
        'new_password',
        'new_password_requested',
        'password'
      ];

      var data = this.toJSON();

      data.hash_id = hashID.encode(data.id);

      _.each(exclude, function(key) {
        delete data[key];
      });

      return data;
    },

    isActive: function() {
      return this.get('banned') === false && this.get('activated') === true;
    },

    fullName: function() {
      if (this.get('first_name') && this.get('last_name')) {
        return this.get('first_name') + ' ' + this.get('last_name');
      }
      return null;
    }
  }
});

module.exports = User;
