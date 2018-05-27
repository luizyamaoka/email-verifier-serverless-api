'use strict';

var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function verify(event, context, callback) {
  var body = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
  var email = (body.email || '').toLowerCase();

  if (!email || email === undefined)
    return buildResponse(200, false);

  if (!EMAIL_REGEX.test(email))
    return buildResponse(200, false);

  return buildResponse(200, true);

  function buildResponse (statusCode, is_valid) {
    var body = {
      email: email,
      is_valid: is_valid,
    };
    var response = {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(body),
    }

    callback(null, response);
  }
}

module.exports.handler = verify;
