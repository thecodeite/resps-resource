'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handle = (event, context, callback) => {
  const timestamp = new Date().toISOString()
  console.error('event:', event);
  const data = JSON.parse(event.body);
  console.error('data:', data);
  if (typeof data.name !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the resps item.'));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      name: data.name,
      schedule: data.schedule,
      created: timestamp,
      updated: timestamp,
    },
  };

  // write the resps to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Failed to create the resps item.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
      headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":"false","Access-Control-Allow-Methods":"GET,OPTIONS,POST,DELETE,PUT","Access-Control-Allow-Headers":"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token","Content-Type":"application/json"}
    };
    callback(null, response);
  });
};
