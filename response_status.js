'use strict';

var response_status = {
  VALID_EMAIL_ADDRESS: {
    is_valid: true,
    status: 'VALID_EMAIL_ADDRESS',
    message: 'The provided email is valid',
  },
  NO_EMAIL_PROVIDED: {
    is_valid: false,
    status: 'NO_EMAIL_PROVIDED',
    message: 'An email address must be provided',
  },
  INVALID_EMAIL_FORMAT: {
    is_valid: false,
    status: 'INVALID_EMAIL_FORMAT',
    message: 'The provided email address does not have a valid email format',
  },
  INVALID_DOMAIN: {
    is_valid: false,
    status: 'INVALID_DOMAIN',
    message: 'The provided email domain does not exist or does not respond',
  },
  INVALID_EMAIL_ADDRESS: {
    is_valid: false,
    status: 'INVALID_EMAIL_ADDRESS',
    message: 'The email address was not recognized by the SMTP server',
  },
  SMTP_CONNECTION_ERROR: {
    is_valid: false,
    status: 'SMTP_CONNECTION_ERROR',
    message: 'There was a problem connecting to the SMTP server',
  },
  SMTP_CONNECTION_TIMEOUT: {
    is_valid: false,
    status: 'SMTP_CONNECTION_TIMEOUT',
    message: 'The SMTP server timed out when trying to establish a connection',
  },
};

module.exports = {
  response_status: response_status,
};
