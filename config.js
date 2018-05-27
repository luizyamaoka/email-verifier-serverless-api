'use strict';

var express = require('express');

exports.setConfig = function(app) {
  app.use(express.json());
  app.use(setupResponseHeaders);
  app.options('/*', function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, session_id');
    res.send(200);
  });
};

function setupResponseHeaders(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}