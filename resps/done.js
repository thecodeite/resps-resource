'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const numberRange = require('../number-range')

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handle = (event, context, callback) => {

  const parts = event.pathParameters.id.split('_')
  const id = parts[0]
  const nr = parts[1]

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {id},
  };

  // fetch resps from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the resps item.'));
      return;
    }

    console.log('result:', result)

    let comp = numberRange.toArray(result.Item.complete || '')
    console.log('comp:', comp)
    comp.push(nr)
    let complete = numberRange.toRange(comp)

    console.log('comp:', comp)

    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {id},
      ExpressionAttributeNames: {
        '#complete': 'complete',
      },
      ExpressionAttributeValues: {
        ':complete': complete
      },
      UpdateExpression: 'SET #complete = :complete',
      ReturnValues: 'ALL_NEW',
    };

    // update the resps in the database
    dynamoDb.update(updateParams, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t update the resps item.'));
        return;
      }

      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Attributes),
        headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":"false","Access-Control-Allow-Methods":"GET,OPTIONS,POST,DELETE,PUT","Access-Control-Allow-Headers":"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token","Content-Type":"application/json"}
      };
    callback(null, response);
  });


  });
};
