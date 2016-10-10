var express = require('express');
var moment = require('moment');
var passport = require('passport');
var config = require('../../../config');
var auth = require('../domain/users/auth');
var registration = require('../domain/users/registration');
var user = require('../domain/user');
var util = require('./util');
var email = require('../domain/email');
var router = express.Router(config.router);
var elasticsearchClient = require('../../../elasticsearch/client');

/**
 * Users
 */

// User registration
router.route('/user/register').post(function(request, response) {
  registration.register(request.body)
  .then(function(user) {

    var data = user.publicJSON();
    util.trackActivity(data.id, 'created_account', null, function(){
      response.json(util.createAPIResponse({
        data: data
      }));
    });
  })
  .catch(function(errors) {
    response.status(400);
    response.json(util.createAPIResponse({
      field_errors: errors
    }));
  });
});

// User email confirmation
router.route('/user/confirm/account').post(function(request, response) {
  registration.confirmAccount(request.body.key)
  .then(function(user) {

    util.trackLogin(user, request);

    // Pull out public user data and generate token
    var data = user.publicJSON();
    data.token = auth.createUserToken(user);
    response.json(util.createAPIResponse({
      data: data
    }));
  })
  .catch(function(error) {
    response.status(400);
    response.json(util.createAPIResponse({
      errors: error ? [error] : []
    }));
  });
});

router.route('/user/confirm/email').post(function(request, response) {
  registration.confirmEmail(request.body.key)
  .then(function(user) {
    // Pull out public user data and generate token
    var data = user.publicJSON();
    data.token = auth.createUserToken(user);

    util.trackActivity(data.id, 'changed_email', null, function(){
      response.json(util.createAPIResponse({
        data: data
      }));
    });
  })
  .catch(function(error) {
    response.status(400);
    response.json(util.createAPIResponse({
      errors: error ? [error] : []
    }));
  });
});

router.route('/user/confirm/password').post(function(request, response) {
  registration.confirmPassword(request.body.key)
  .then(function(user) {
    // Pull out public user data and generate token
    var data = user.publicJSON();
    data.token = auth.createUserToken(user);

    util.trackActivity(data.id, 'changed_password', null, function(){
      response.json(util.createAPIResponse({
        data: data
      }));
    });
  })
  .catch(function(error) {
    response.status(400);
    response.json(util.createAPIResponse({
      errors: error ? [error] : []
    }));
  });
});

// User login
router.route('/user/login').post(function(request, response) {

  passport.authenticate('local', function(error, user, info) {
    if (error) {
      response
        .status(401)
        .json(util.createAPIResponse({
          errors: error ? [error] : []
        }));
      return;
    }

    util.trackLogin(user, request);
    util.trackActivity(user.get('id'), 'login');

    // Pull out public user data and generate token
    var data = user.publicJSON();
    data.token = auth.createUserToken(user);

    response.json(util.createAPIResponse({
      data: data
    }));

  })(request, response);
});

// User logout
router.route('/user/logout').post(function(request, response) {
  util.isValidUser(request, function(validUserId){
    if(validUserId){
      util.trackActivity(validUserId, 'logout', null, function(){
        response.json(util.createAPIResponse({
          data: {
            success: true
          }
        }));
      });
    } else {
      response.json(util.createAPIResponse({
        error: true,
        errors: ['Invalid API Authorization Token']
      }));
    }
  });
});

router.route('/user/update').post(function(request, response) {
  util.isValidUser(request, function(validUserId){
    if(validUserId){
      passport.authenticate('local', function(error, account, info) {

        // Check for Invalid User Account
        if (error) {
          response.json(util.createAPIResponse({
            error: true,
            errors: ['Incorrect Password']
          }));
        } else {

          var usernameChecked = false;
          var emailChecked = false;
          var passwordChecked = false;

          var updateAccount = function(){

            if(usernameChecked && emailChecked && passwordChecked){
              return user.updateAccount(validUserId, request.body, request.headers['x-forwarded-for'])
              .then(function(updated) {
                response.json(util.createAPIResponse({
                  data: updated
                }));
              })
              .catch(function(errors) {
                response.status(400);
                response.json(util.createAPIResponse({
                  error: true,
                  errors: [errors.toString()]
                }));
              });
            }
          };

          // CHECK FOR ANY ERRORS BEFORE UPDATING DATA

          // Check if we are changing the username
          if(request.body.new_username){

            // Check for invalid username
            if( !registration.validUserName(request.body.new_username)){
              response.status(400);
              response.json(util.createAPIResponse({
                error: true,
                errors: ['Invalid Username. Required Length: 3-30, Allowed Characters: a-Z0-9_']
              }));
              return;
            }

            // Check if old an new usernames are identical
            if(request.body.username.toLowerCase() === request.body.new_username.toLowerCase()){
              response.status(400);
              response.json(util.createAPIResponse({
                error: true,
                errors: ['New Username and Current Username are identical.']
              }));
              return;
            }

            // Check if new username is already in use
            user.usernameInUse(request.body.new_username, function(inUse){
              if(inUse){
                response.status(400);
                response.json(util.createAPIResponse({
                  error: true,
                  errors: ['Username already in use.']
                }));
                return;
              } else {

                util.trackActivity(validUserId, 'changed_username', null, function(){});
                usernameChecked = true;
                updateAccount();
              }
            });
          } else {
            usernameChecked = true;
          }

          // Check if we are changing the email address
          if(request.body.new_email){

            // Check if old an new email addresses are identical
            if(request.body.email.toLowerCase() === request.body.new_email.toLowerCase()){
              response.status(400);
              response.json(util.createAPIResponse({
                error: true,
                errors: ['New Email Address and Current Email Address are identical.']
              }));
              return;
            }

            // Check if new email address is already in use
            user.emailAddressInUse(request.body.new_email, function(inUse){
              if(inUse){
                response.status(400);
                response.json(util.createAPIResponse({
                  error: true,
                  errors: ['Email Address already in use.']
                }));
                return;
              } else {
                emailChecked = true;
                updateAccount();
              }
            });
          } else {
            emailChecked = true;
          }

          // Check if we are changing the password
          if(request.body.new_password){

            // Check for minimum length requirement
            if(request.body.password.length < 6){
              response.status(400);
              response.json(util.createAPIResponse({
                error: true,
                errors: ['Minimum Password Length is 6 characters.']
              }));

              return;
            } else if(request.body.password === request.body.new_password){

              // Check if old an new passwords are identical
              response.status(400);
              response.json(util.createAPIResponse({
                error: true,
                errors: ['New Password and Current Password are identical.']
              }));

              return;

            } else {
              passwordChecked = true;
              return updateAccount();
            }
          } else {
            passwordChecked = true;
          }

          return updateAccount();

        }
      })(request, response);

    } else {
      response.json(util.createAPIResponse({
        error: true,
        errors: ['Invalid API Authorization Token']
      }));
    }
  });
});

// Delete User Account
router.route('/user/delete').delete(function(request, response) {

  util.isValidUser(request, function(validUserId){
    if(validUserId){
      passport.authenticate('local', function(error, account, info) {
        if (error) {
          response.json(util.createAPIResponse({
            error: true,
            errors: ['Incorrect Password']
          }));
        } else {
          user.deleteAccount(account)
          .then(function() {
            util.trackActivity(validUserId, 'logout', null, function(){
              response.json(util.createAPIResponse({
                data: account.publicJSON()
              }));
            });
          })
          .catch(function(errors) {
            response.status(400);
            response.json(util.createAPIResponse({
              error: true,
              errors: [errors.toString()]
            }));
          });
        }
      })(request, response);
    } else {
      response.json(util.createAPIResponse({
        error: true,
        errors: ['Invalid API Authorization Token']
      }));
    }
  });
});

// User token refresh, extracts the token out of the Authorization header
// and refreshes it, returning a new token under data: {token: '...'}

router.route('/user/refresh').post(function(request, response) {
  var errorMessage = 'No Authorization header found';

  if (request.headers && request.headers.authorization) {
    var parts = request.headers.authorization.split(' ');

    if (parts.length === 2) {
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        var token = credentials;
        var newToken = auth.refreshToken(token);
        if (newToken) {
          response.json(util.createAPIResponse({
            data: {
              token: newToken
            }
          }));
          return;
        } else {
          errorMessage = 'Invalid or expired token';
        }
      } else {
        errorMessage = 'Malformed Authorization header, must be "Bearer (token)"';
      }
    } else {
      errorMessage = 'Malformed Authorization header, must be "Bearer (token)"';
    }
  }

  // Return an error
  response.status(400).json(util.createAPIResponse({ errors: [errorMessage] }));
});

// User forgot password
router.route('/user/forgot-password').post(function(request, response) {
  var ipAddress = request.headers['x-forwarded-for'];
  registration.forgotPassword(request.body)
  .then(function(user) {

    util.getGeoLocation(ipAddress, function(geolocation){
      email.sendUserForgotPasswordEmail(user, geolocation);
    });

    response.json(util.createAPIResponse({
      data: user.publicJSON()
    }));
  })
  .catch(function(errors) {
    response.status(400);
    response.json(util.createAPIResponse({
      error: true,
      errors: [errors.toString()]
    }));
  });
});

// User reset password

router.route('/user/reset-password').post(function(request, response) {
  registration.resetPassword(request.body)
  .then(function(user) {

    util.getGeoLocation(request.headers['x-forwarded-for'], function(geolocation){
      email.sendUserPasswordResetEmail(user, geolocation);
    });

    var data = user.publicJSON();
    util.trackActivity(data.id, 'reset_password', null, function(){
      response.json(util.createAPIResponse({
        data: data
      }));
    });
  })
  .catch(function(errors) {
    response.status(400);
    response.json(util.createAPIResponse({
      error: true,
      errors: [errors.toString()]
    }));
  });
});

router.route('/user/resend-confirmation/:id').get(function(request, response) {
  registration.resendConfirmation(request.params.id)
  .then(function(message) {
    response.json(util.createAPIResponse({
      data: message
    }));
  })
  .catch(function(errors) {
    response.status(400);
    response.json(util.createAPIResponse({
      error: true,
      errors: [errors.toString()]
    }));
  });
});

router.route('/user/:username/profile').get(function(request, response) {

  // Defaults
  var page = 1;

  var env = config.get('env');
  var indexType = env + '_user';
  var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

  var searchParams = {
    index: indexName,
    body: {}
  };

  if(request.params.username){
    searchParams.body = {
      query: {
        match: {
          username: request.params.username
        }
      }
    };
  }

  elasticsearchClient.search(searchParams)
  .then(function(result) {
    var data = result.hits.hits.map(user.prepareForAPIOutput);
    if(data && data.length === 1){
      response.json(util.createAPIResponse({
        meta: {
          total: result.hits.total,
          showing: result.hits.hits.length,
          pages: Math.ceil(result.hits.total/searchParams.size),
          page: page
        },
        data: data[0]
      }));
    } else {
      response.status(400);
      response.json(util.createAPIResponse({
        meta: {
          total: 0,
          showing: 0,
          pages: 1,
          page: 1
        },
        error: true,
        errors: ['No Matching Username'],
        data: []
      }));
    }
  })
  .catch(function(error) {
    response.json(util.createAPIResponse({
      errors: [error]
    }));
  });
});

router.route('/user/:username/follow').post(function(request, response) {
  util.isValidUser(request, function(validUserId){

    if(validUserId){

      if( !request.params.username){
        response.json(util.createAPIResponse({
          error: true,
          errors: ['Missing Username']
        }));
      }

      user.followUser(validUserId, request.params.username)
        .then(function(followedUser) {
          util.trackActivity(validUserId, 'followed_user', followedUser, function(){
            response.json(util.createAPIResponse({
              data: followedUser
            }));
          });
        })
        .catch(function(errors) {
          response.status(400);
          response.json(util.createAPIResponse({
            error: true,
            errors: [errors.toString()]
          }));
        });
    } else {
      response.json(util.createAPIResponse({
        error: true,
        errors: ['Invalid API Authorization Token']
      }));
    }
  });
});

router.route('/user/:username/unfollow').post(function(request, response) {
  util.isValidUser(request, function(validUserId){

    if(validUserId){

      if( !request.params.username){
        response.json(util.createAPIResponse({
          error: true,
          errors: ['Missing Username']
        }));
      }

      user.unfollowUser(validUserId, request.params.username)
        .then(function(unfollowedUser) {
          response.json(util.createAPIResponse({
            data: unfollowedUser.dataValues
          }));
        })
        .catch(function(errors) {
          response.status(400);
          response.json(util.createAPIResponse({
            error: true,
            errors: [errors.toString()]
          }));
        });
    } else {
      response.json(util.createAPIResponse({
        error: true,
        errors: ['Invalid API Authorization Token']
      }));
    }
  });
});

router.route('/user/:username/followers').get(function(request, response) {
  if( !request.params.username){
    response.json(util.createAPIResponse({
      error: true,
      errors: ['Missing Username']
    }));
  }

  user.getFollowers(request.params.username)
    .then(function(followers) {
      response.json(util.createAPIResponse({
        data: followers
      }));
    })
    .catch(function(errors) {
      response.status(400);
      response.json(util.createAPIResponse({
        error: true,
        errors: [errors.toString()]
      }));
    });
});

router.route('/user/:username/following').get(function(request, response) {
  if( !request.params.username){
    response.json(util.createAPIResponse({
      error: true,
      errors: ['Missing Username']
    }));
  }

  user.getFollowing(request.params.username)
    .then(function(following) {
      response.json(util.createAPIResponse({
        data: following
      }));
    })
    .catch(function(errors) {
      response.status(400);
      response.json(util.createAPIResponse({
        error: true,
        errors: [errors.toString()]
      }));
    });
});

// User Invitations
router.route('/user/invite/:key').get(function(request, response) {
  user.checkInviteCode(request.params.key)
    .then(function(invites) {
      response.json(util.createAPIResponse({
        data: invites
      }));
    })
    .catch(function(error) {
      response.status(400);
      response.json(util.createAPIResponse({
        errors: [error]
      }));
    });
});

module.exports = router;
