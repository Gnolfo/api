var assert = require('chai').assert;
// require('../bootstrap');

describe('API Server', function() {
  var server;

  beforeEach(function() {
    server = require('../../app/server');
  });

  afterEach(function() {
    server.close();
  });

  it('should be defined', function() {
    assert.isDefined(server);
  });
});
