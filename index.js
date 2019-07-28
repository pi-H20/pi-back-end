'use strict';

require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const app = express();


AWS.config.update({
  "region": 'us-east-1',
  "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
  "accessKeyId": process.env.ACCESSKEYID,
  "secretAccessKey": process.env.SECRETKEYID
});


const docClient = new AWS.DynamoDB.DocumentClient();

// AWS.config.update({
//   region: 'us-west-2',
// });

app.get('/', (req, res)=> {
  res.send("Home page stub route")
})

app.get('/login', (req, res)=> {
  res.send("this is going to be the login page.")
})

// TODO: Might have to write sql query directly for dynamoDB. Should be a post route
app.get('/data', (req, res)=> {

  var params = {
      TableName: "plantUser",
      Key: {
        "plantUserId": "123123"
      }
  };

  docClient.get(params, function(err, data) {
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          console.log(data.Item);
          res.send("here is the object that is being returned with username " + data.Item.username)
      }
  });

})

app.listen(process.env.PORT || 3000);

