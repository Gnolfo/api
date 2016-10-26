var config = require('./config');
var logger = require('logzio-nodejs');
var log;

if (config.get('env') !== 'test') {
  log = logger.createLogger({
    token: config.get('logzio.token'),
    type: config.get('logzio.type'),
    debug: config.get('logzio.debug')
  });
} else {
  log = {
    debug: function(){},
    error: function(){},
    info: function(){},
    log: function(){},
    warn: function(){}
  };
}

module.exports = log;
