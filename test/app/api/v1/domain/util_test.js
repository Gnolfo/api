var assert = require('chai').assert;
var sinon = require('sinon');
var http = require('http');
var mockReq = require('mock-req');
var mockRes = require('mock-res');

var util = require('../../../../../app/api/v1/domain/util');

describe('Domain Util', function() {
  it('should be defined', function() {
    assert.isDefined(util);
  });

  describe('normalizeCommaSeparatedIntegers', function() {
    it('should exist', function () {
      assert.isFunction(util.normalizeCommaSeparatedIntegers);
    });

    it('should return an array of integers from a comma-separated string of numbers', function () {
      var str = '1,5,6';
      var expected = [1, 5, 6];
      assert.deepEqual(util.normalizeCommaSeparatedIntegers(str), expected);
    });

    it('should return null for invalid input', function() {
      var str = 'foo';
      var expected = null;
      assert.deepEqual(util.normalizeCommaSeparatedIntegers(str), expected);
    });

    it('should prune out invalid input', function() {
      var str = '1,foo,6';
      var expected = [1, 6];
      assert.deepEqual(util.normalizeCommaSeparatedIntegers(str), expected);
    });
  });

  describe('getContent', function() {
    beforeEach(function() {
      this.request = sinon.stub(http, 'request');
    });

    afterEach(function() {
      http.request.restore();
    });

    it('should exist', function () {
      assert.isFunction(util.getContent);
    });

    it('should return data', function(done) {
      var expected = { hello: 'world' };
      var response = new mockRes();

      response.write(JSON.stringify(expected));
      response.end();

      var request = new mockReq();

      this.request.callsArgWith(1, response).returns(request);

      util.getContent('http://test.com').then(function (result) {
        assert.deepEqual(JSON.parse(result), expected);
        done();
      })
    });

    it('should detect statusCode errors', function(done) {
      var expected = new Error('Failed to load page, status code: 403');
      var response = new mockRes();

      response.statusCode = 403;

      response.write(JSON.stringify(expected));
      response.end();

      var request = new mockReq();

      this.request.callsArgWith(1, response).returns(request);

      util.getContent('http://test.com').catch(function (error) {
        assert.deepEqual(error, expected);
        done();
      })
    });

    it('should return failure', function(done) {
      var expected = 'some error';
      var request = new mockReq();

      this.request.returns(request);

      util.getContent('https://test.com').catch(function (error) {
        assert.deepEqual(error, expected);
        done();
      });

      request.emit('error', expected);
    });
  });

  describe('buildUrl', function() {
    it('should exist', function () {
      assert.isFunction(util.buildUrl);
    });

    it('should build URL', function() {
      var expected = {
        domain: 'http://test.com',
        query: '?a=1&b=2',
        url: 'http://test.com?a=1&b=2'
      };

      assert.deepEqual(util.buildUrl('http://test.com', { a: 1, b: 2 }), expected);
    });

    it('should build URL without params', function() {
      var expected = {
        domain: 'http://test.com',
        query: '',
        url: 'http://test.com'
      };

      assert.deepEqual(util.buildUrl('http://test.com'), expected);
    });
  });
});