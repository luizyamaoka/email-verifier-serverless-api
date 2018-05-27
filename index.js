'use strict';

var serverless = require('serverless-http');
var express = require('express');
var app = express();

var config = require('./config');
config.setConfig(app);

app.post('/verify', verify);

var email;

function verify(req, res) {
  email = (req.body.email || '').toLowerCase();

  if (!email || email === undefined)
    return res.send(buildResponse(false));

  return res.send(buildResponse(true));
}

function buildResponse(is_valid) {
  var response = {
    email: email,
    is_valid: is_valid
  };
  return JSON.stringify(response);
}

module.exports.handler = serverless(app);
