'use strict';

var assert = require('assert');
var LambdaTester = require( 'lambda-tester' );

var handler = require('../controller/email').handler;

describe('email not provided', function() {
  it('should return not valid', function() {
    return LambdaTester( handler )
      .event(buildEvent(''))
      .expectResult( function (result) {
        assert.equal(JSON.parse(result.body).is_valid, false);
      });
  });
});

describe('email with invalid regex', function() {
  it('should return not valid', function() {
    return LambdaTester( handler )
      .event(buildEvent('foo@bar@email.com'))
      .expectResult( function (result) {
        assert.equal(JSON.parse(result.body).is_valid, false);
      });
  });
});

describe('valid email', function() {
  it('should return valid', function() {
    return LambdaTester( handler )
      .event(buildEvent('luiz.yamaoka@gmail.com'))
      .expectResult( function (result) {
        assert.equal(JSON.parse(result.body).is_valid, true);
      });
  });
});

function buildEvent(email) {
  var event = {
  	body: {
  	  email: email,
  	}
  }
  return event;
}
