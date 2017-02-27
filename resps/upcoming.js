'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const upcomingResponsibilitiesService = require('../upcomingResponsibilitiesService')

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

module.exports.handle = (event, context, callback) => {
  // fetch all respss from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the respss.'));
      return;
    }

    const upcoming = upcomingResponsibilitiesService
      .getResponsibilitiesAfterNow(result.Items, 10)


    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(upcoming),
      headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":"false","Access-Control-Allow-Methods":"GET,OPTIONS,DELETE,PUT","Access-Control-Allow-Headers":"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token","Content-Type":"application/json"}
    };
    callback(null, response);
  });
};
