var _ = require('lodash');
var User = require('../../../models/api/users');
var md5 = require('md5');

var SearchDomain = {
  users: function(params){
    if (params) {
      return User.findAll({
          where: {
            $or: {
              username: {
                $like: '%' + params.query + '%'
              },
              first_name: {
                $like: '%' + params.query + '%'
              },
              last_name: {
                $like: '%' + params.query + '%'
              },
              profile_name: {
                $like: '%' + params.query + '%'
              },
              company_name: {
                $like: '%' + params.query + '%'
              },
              bio: {
                $like: '%' + params.query + '%'
              }
            },
            activated: true,
            banned: false
          }
        })
        .then(function(users) {
          if(users){
            var cleanData = [];

            for(var i = 0; i < users.length; i++){

              var u = users[i];

              var userCleaned = {
                id: u.id,
                username: u.username,
                profile_name: u.profile_name,
                profile_photo: (u.profile_photo) ? u.profile_photo : 'https://secure.gravatar.com/avatar/' + md5(u.email) + '?r=g&s=200&d=identicon',
                joined_on: u.created_date
              };

              cleanData.push(userCleaned);
            }

            return cleanData;

          } else {
            return [];
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  }
};

module.exports = SearchDomain;
