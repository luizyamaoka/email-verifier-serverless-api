# email-verifier-serverless-api

[![Build Status][tb]][tp]

> Serverless API to verify if the provided email is valid.

[tb]: https://api.travis-ci.org/luizyamaoka/email-verifier-serverless-api.svg?branch=master
[tp]: https://travis-ci.org/luizyamaoka/email-verifier-serverless-api

## How does it work

After receiving a request containing an email to be tested, the application will perform the following tests on it:
* Format: The provided email will be tested against an email regex to check if it has a valid email format
* MX Record: Check the existance of an MX record for the email domain
* SMTP Server: Connect to the mail server and check its existance

## Installation

``` shell
$ git clone https://github.com/luizyamaoka/email-verifier-serverless-api.git
$ cd email-verifier-serverless-api
$ make install
```

## Run tests

Tests include:
* code style tests
* unit tests

``` shell
$ make test
```

## Run in development mode

In development mode the application will run on port 3000

``` shell
$ make run-dev
```

## Deploy to production

This application is configured to run on [AWS Lambda](https://aws.amazon.com/lambda/) at the us-east-1 region. In order to change this configuration you can change the [serverless.yml](/serverless.yml) file.

Do not forget to setup your AWS credentials at `~/.aws/credentials`.

``` shell
$ make deploy
```

## Usage

A POST request must be sent to the `/verify` endpoint in order to validate an email.

The request must contain a JSON body containing an object with an item called `email`.

``` shell
$ curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "foo@bar.com"}' \
  localhost:3000/verify 
```

## Response

The API will always respond with the following fields
* email: returning which email is being tested
* is_valid: boolean indicating whether the email is valid or not

#### Example response

``` json
{
  "email": "foo@bar.com",
  "is_valid": true
}
```
