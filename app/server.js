/**
 * @module server
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var rateLimit = require('express-rate-limit');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var debug = require('debug')('express:blackdove');
var config = require('./config');
var router = require('./router');
var bugsnag = require('bugsnag');
var session = require('express-session');
var uuid = require('uuid');
var model = require('./models');
var app = express();
var apiUser = {};
var apiLimit = {
  delayAfter: 0,
  delayMs: 0,
  windowMs: 24 * 60 * 60 * 1000,
  max: 2500
};
var limiter = rateLimit(apiLimit);
var routerUtil = require('./api/v1/routes/util.js');

process.title = 'api';

/* istanbul ignore next */
function setupAPI(request, response, next) {
  if ('pretty' in request.query && request.query.pretty !== 'false') {
    app.set('json spaces', 2);
  }

  var host = request.headers.origin;
  var acceptedMethods = ['OPTIONS'];

  if(request.header('API-Key')){
    request.query.apikey = request.header('API-Key');
  }

  if(request.headers.host){
    apiUser.host = request.headers.host;
  }

  if (request.query.apikey) {

    return model.API.ApiAuthentication.findOne({ where: { api_key: request.query.apikey }}).then(function(user){

      if(user){
        var settings = user.dataValues;

        if (settings.allow_api_get) {
          acceptedMethods.push('GET');
        }

        if (settings.allow_api_post) {
          acceptedMethods.push('POST');
        }

        if (settings.allow_api_put) {
          acceptedMethods.push('PUT');
        }

        if (settings.allow_api_delete) {
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

        if (!settings.allow_api_get && request.method === 'GET') {
          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support GET Requests'],
            data: []
          })));
        }

        if (!settings.allow_api_post && request.method === 'POST') {
          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support POST Requests'],
            data: []
          })));
        }

        if (!settings.allow_api_put && request.method === 'PUT') {
          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support PUT Requests'],
            data: []
          })));
        }

        if (!settings.allow_api_delete && request.method === 'DELETE') {
          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support DELETE Requests'],
            data: []
          })));
        }

        // Check for approved host
        if(settings.approved_whitelist && settings.approved_whitelist !== '*'){
          var whitelist = settings.approved_whitelist.split(',');
          var validHost = false;

          for (var i = 0; i < whitelist.length; i++) {
            if (whitelist.indexOf(apiUser.host) === -1) {
              validHost = true;
            }
          }

          if( !validHost) {
            return response.status(401).send(JSON.stringify(routerUtil.createAPIResponse({
              errors: ['Invalid Host for API Key'],
              data: []
            })));
          }
        }

        // Set API Limits
        apiLimit.max = (!isNaN(settings.daily_limit)) ? (parseInt(settings.daily_limit, 10)) : 1000;
        limiter = rateLimit(apiLimit);

        next();

      } else {
        return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
          errors: ['Invalid API Key'],
          data: []
        })));
      }
    }).catch(function(err){
      return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
        errors: ['Invalid API Authentication'],
        data: []
      })));
    });
  } else {
    return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
      errors: ['Missing API Key'],
      data: []
    })));
  }

  next();
}

app.enable('trust proxy');

/**
 * Allow for Timeout JSON Response
 */
app.use(function(req, res, next){
  res.setTimeout(3000, function(){
    res.status(408).end(JSON.stringify(routerUtil.createAPIResponse({
      errors: ['Request Timed Out'],
      data: []
    })));
  });

  next();
});

/* istanbul ignore next */
app.use(session({
  genid: function(){ return uuid.v4(); },
  secret: config.get('sessionKey'),
  resave: true,
  saveUninitialized: true
}));

app.use('/favicon.ico', express.static(__dirname + '/static/favicon.ico'));
app.use('/robots.txt', express.static(__dirname + '/static/robots.txt'));
app.use('/humans.txt', express.static(__dirname + '/static/humans.txt'));
app.use('/docs.js', express.static(__dirname + '/static/docs.js'));
app.use('/docs.css', express.static(__dirname + '/static/docs.css'));
app.use('/docs', express.static(__dirname + '/static/docs'));

app.use(setupAPI);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(limiter);
app.use(router);

module.exports = app.listen(config.get('port'));
module.exports.setupAPI = setupAPI;