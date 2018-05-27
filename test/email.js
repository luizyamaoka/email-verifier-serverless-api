'use strict';

var assert = require('assert');
var LambdaTester = require( 'lambda-tester' );

var handler = require('../controller/email').handler;

var tests = [
  { email: '', is_valid: false },
  { email: 'foo@bar@email.com', is_valid: false },
  { email: 'email with space@email.com', is_valid: false },
  { email: 'emailwithnoat', is_valid: false },
  { email: 'luiz.yamaoka@gmail.com', is_valid: true },
];

for (var i in tests) {
  var test = tests[i];
  describe('Test email "' + test['email'] + '"', function() {
    it('should return is_valid = ' + test['is_valid'], function() {
      return LambdaTester( handler )
        .event(buildEvent(test['email']))
        .expectResult( function (result) {
          assert.equal(JSON.parse(result.body).is_valid, test['is_valid']);
        });
    });
  });
}

function buildEvent(email) {
  var event = {
  	body: {
  	  email: email,
  	}
  }
  return event;
}
