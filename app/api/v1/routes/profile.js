var express = require('express');
var config = require('../../../config');
var profile = require('../domain/profile');
var util = require('./util');
var router = express.Router(config.router);

router.route('/profile/activity').get(function(request, response) {

  util.isValidUser(request, function(validUserId){

    if(validUserId){
      profile.getActivity(validUserId)
        .then(function(activity) {
          response.json(util.createAPIResponse({
            data: activity
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

router.route('/profile/notifications').get(function(request, response) {

  util.isValidUser(request, function(validUserId){
    if(validUserId){
      profile.getNotifications(validUserId)
        .then(function(user) {
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
    } else {
      response.json(util.createAPIResponse({
        error: true,
        errors: ['Invalid API Authorization Token']
      }));
    }
  });
});

module.exports = router;
