var express = require('express');
var config = require('../../../config');
var settings = require('../domain/settings');
var util = require('./util');
var router = express.Router(config.router);

router.route('/settings').get(function(request, response) {

  util.isValidUser(request, function(validUserId){
    if(validUserId){
      settings.getSettings(validUserId)
        .then(function(settings) {
          response.json(util.createAPIResponse({
            data: settings
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

router.route('/settings/profile').post(function(request, response) {

  util.isValidUser(request, function(validUserId){
    if(validUserId){
      request.body.id = validUserId;
      settings.updateUserProfile(request.body)
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

router.route('/settings/social-links').post(function(request, response) {

  util.isValidUser(request, function(validUserId){
    if(validUserId){
      request.body.id = validUserId;
      settings.updateSocialLinks(request.body)
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

router.route('/settings/email-notifications').post(function(request, response) {

  util.isValidUser(request, function(validUserId){
    if(validUserId){
      request.body.id = validUserId;
      settings.updateEmailNotifications(request.body)
        .then(function(settings) {
          response.json(util.createAPIResponse({
            data: settings.dataValues
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

router.route('/settings/web-notifications').post(function(request, response) {

  util.isValidUser(request, function(validUserId){
    if(validUserId){
      request.body.id = validUserId;
      settings.updateWebNotifications(request.body)
        .then(function(settings) {
          response.json(util.createAPIResponse({
            data: settings.dataValues
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
