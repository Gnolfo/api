var rateLimit = require('express-rate-limit');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var debug = require('debug')('express:blackdove');
var config = require('./config');
var router = require('./router');
var bugsnag = require('bugsnag');
var passport = require('passport');
var auth = require('passport-localapikey').Strategy;
var session = require('express-session');
var uuid = require('uuid');
var authentication = require('./models/api/api_authentication');
var app = express();
var apiUser = {};
var apiLimit = {
  delayAfter: 0,
  delayMs: 0,
  windowMs: 24 * 60 * 60 * 1000,
  max: 1000
};
var limiter = rateLimit(apiLimit);
var routerUtil = require('./api/v1/routes/util.js');

process.title = 'api';

function json(request, response, next) {
  if ('pretty' in request.query && request.query.pretty !== 'false') {
    app.set('json spaces', 2);
  }
  next();
}

function setupAPI(request, response, next) {

  var host = request.headers.origin;
  var acceptedMethods = ['OPTIONS'];

  if(request.header('API-Key')){
    request.query.apikey = request.header('API-Key');
  }

  if(request.headers.host){
    apiUser.host = request.headers.host;
  }

  if (request.query.apikey) {
    return authentication.findOne({ where: { api_key: request.query.apikey }}).then(function(user){

      if(user){
        apiUser.settings = user.dataValues;


        if (user.dataValues.allow_api_get) {
          acceptedMethods.push('GET');
        }

        if (user.dataValues.allow_api_post) {
          acceptedMethods.push('POST');
        }

        if (user.dataValues.allow_api_put) {
          acceptedMethods.push('PUT');
        }

        if (user.dataValues.allow_api_delete) {
          acceptedMethods.push('DELETE');
        }

        // Allow OPTIONS from all hosts
        if(request.method === 'OPTIONS'){
          host = '*';
        }

        response.setHeader('X-Powered-By', 'API');
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Access-Control-Allow-Headers', 'Accept, Access-Control-Allow-Methods, Authorization, Content-Type, X-Powered-By');
        response.setHeader('Access-Control-Allow-Methods', acceptedMethods.join(', '));

        if (host) {
          response.setHeader('Access-Control-Allow-Origin', host);
        }

        // Check for approved host
        if(user.dataValues.approved_whitelist && user.dataValues.approved_whitelist !== '*'){
          var whitelist = user.dataValues.approved_whitelist.split(',');
          var validHost = false;

          for (var i = 0; i < whitelist.length; i++) {
            if (whitelist.indexOf(apiUser.host) === -1) {
              validHost = true;
            }
          }

          if( !validHost) {
            response.status(401).send(JSON.stringify(routerUtil.createAPIResponse({
              errors: ['Invalid Host for API Key'],
              data: []
            })));

            next();
          }
        }

        // Set API Limits
        apiLimit.max = (!isNaN(user.dataValues.daily_limit)) ? (parseInt(user.dataValues.daily_limit, 10)) : 1000;
        limiter = rateLimit(apiLimit);

        next();

      } else {
        return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
          errors: ['Invalid API Key'],
          data: []
        })));

        next();
      }
    }).catch(function(err){
      return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
        errors: ['Invalid API Authentication'],
        data: []
      })));

      next();
    });
  }

  next();
}

// Setup Bug Tracking
bugsnag.register(config.get('bugsnag'), {
  releaseStage: config.get('env'),
  notifyReleaseStages: ['production']
});

app.enable('trust proxy');
app.use(session({
  genid: function(){ return uuid.v4(); },
  secret: config.get('sessionKey'),
  resave: true,
  saveUninitialized: true
}));

app.use(bugsnag.requestHandler);
app.use(bugsnag.errorHandler);
app.use(json);
app.use(setupAPI);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(limiter);
app.use(router);

module.exports = app.listen(config.get('port'));

