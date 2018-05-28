'use strict';

var assert = require('assert');
var LambdaTester = require('lambda-tester');

var handler = require('../controller/email').handler;

var tests = [
  { email: '', is_valid: false, status: 'NO_EMAIL_PROVIDED' },
  { email: 'foo@bar@email.com', is_valid: false, status: 'INVALID_EMAIL_FORMAT' },
  { email: 'email with space@email.com', is_valid: false, status: 'INVALID_EMAIL_FORMAT' },
  { email: 'emailwithnoat', is_valid: false, status: 'INVALID_EMAIL_FORMAT' },
  { email: 'invaliddomain@klajdksladasdlk.com', is_valid: false, status: 'INVALID_DOMAIN' },
  { email: 'unexistant.email.jkslajdkalkdjkald@gmail.com', is_valid: false, status: 'INVALID_EMAIL_FORMAT' },
  { email: 'support@github.com', is_valid: true, status: 'VALID_EMAIL_ADDRESS' },
];

for (var i in tests) {
  var test = tests[i];
  describe('Test email "' + test['email'] + '"', function() {
    it('should return is_valid = ' + test['is_valid'], function() {
      return LambdaTester(handler)
        .event(buildEvent(test['email']))
        .expectResult( function (result) {
          assert.equal(JSON.parse(result.body).is_valid, test['is_valid']);
        });
    });

    it('should return status = ' + test['status'], function() {
      return LambdaTester(handler)
        .event(buildEvent(test['email']))
        .expectResult( function (result) {
          assert.equal(JSON.parse(result.body).status, test['status']);
        });
    });
  });
}

function buildEvent(email) {
  var event = {
  	body: {
  	  email: email,
  	}
  };
  return event;
}
