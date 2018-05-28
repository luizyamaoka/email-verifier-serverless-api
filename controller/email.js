'use strict';

var dns = require('dns');
var net = require('net');

var RESPONSE_STATUS = require('../response_status.js').response_status;

var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var HTTP_STATUS = {
  OK: 200,
};
var SMTP = {
  PORT: 25,
  TIMEOUT: 25000,
  COMMAND: {
    HELO: 0,
    MAIL_FROM: 1,
    RCPT_TO: 2,
    QUIT: 3,
    END: 4,
  },
};

function verify(event, context, callback) {
  var body = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
  var email = (body.email || '').toLowerCase();
  var domain = getEmailDomain(email);

  if (!email || email === undefined)
    return respond(HTTP_STATUS.OK, RESPONSE_STATUS.NO_EMAIL_PROVIDED);

  if (!EMAIL_REGEX.test(email))
    return respond(HTTP_STATUS.OK, RESPONSE_STATUS.INVALID_EMAIL_FORMAT);

  return checkMxRecord();

  function respond(status_code, response_status) {
    var body = {
      email: email,
      is_valid: response_status.is_valid,
      status: response_status.status,
      message: response_status.message,
    };
    var response = {
      statusCode: status_code,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(body),
    };

    callback(null, response);
  }

  function getEmailDomain(email) {
    return email.split(/[@]/).splice(-1)[0];
  }

  function checkMxRecord() {
    dns.resolveMx(domain, function(err, addresses) {
      if (err || !addresses || addresses === undefined || addresses.length === 0) {
        return respond(HTTP_STATUS.OK, RESPONSE_STATUS.INVALID_DOMAIN);
      } else {
        var smtp = getMailServer(addresses);
        return checkSmtpServer(smtp);
      }
    });
  }

  function getMailServer(addresses) {
    var min_priority = 0;

    for (var i in addresses)
      if (addresses[i].priority < addresses[min_priority].priority)
        min_priority = i;

    return addresses[min_priority].exchange;
  }

  function checkSmtpServer(smtp) {
    var step = 0;
    var success = false;
    var response = '';

    var commands = [
      'EHLO ' + domain + '\r\n',
      'MAIL FROM:<teste@gmail.com>\r\n',
      'RCPT TO:<' + email + '>\r\n',
      'QUIT\r\n',
    ];

    var socket = net.createConnection(SMTP.PORT, smtp);

    socket.setTimeout(SMTP.TIMEOUT, function() {
      socket.destroy();
      return respond(HTTP_STATUS.OK, RESPONSE_STATUS.SMTP_CONNECTION_TIMEOUT);
    });

    socket.on('data', function(data) {
      response += data.toString();
      switch (step) {
        case SMTP.COMMAND.HELO:
          if (response.indexOf('220') > -1) {
            socket.write(commands[step], goToNextStep());
          } else
            socket.end();
          break;
        case SMTP.COMMAND.MAIL_FROM:
          if (response.indexOf('250') > -1) {
            socket.write(commands[step], goToNextStep());
          } else {
            if (response.indexOf('220') <= -1)
              socket.end();
          }
          break;
        case SMTP.COMMAND.RCPT_TO:
          if (response.indexOf('250') > -1) {
            socket.write(commands[step], goToNextStep());
          } else
            socket.end();
          break;
        case SMTP.COMMAND.QUIT:
          if (response.indexOf('250') > -1)
            success = true;
          socket.write(commands[step], goToNextStep());
          break;
        case SMTP.COMMAND.END:
          socket.end();
      }
    });

    socket.once('error', function() {
      return respond(HTTP_STATUS.OK, RESPONSE_STATUS.SMTP_CONNECTION_ERROR);
    });

    socket.once('end', function() {
      if (success)
        return respond(HTTP_STATUS.OK, RESPONSE_STATUS.VALID_EMAIL_ADDRESS);
      else
        return respond(HTTP_STATUS.OK, RESPONSE_STATUS.INVALID_EMAIL_ADDRESS);
    });

    function goToNextStep() {
      step++;
      response = '';
    }
  }
}

module.exports.handler = verify;
