'user-strict'

const express = require('express');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const router = express.Router();

//middleware
require('dotenv').config();

// configure aws
AWS.config.update({
  "region": 'us-east-1',
  "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
  "accessKeyId": process.env.ACCESSKEYID,
  "secretAccessKey": process.env.SECRETKEYID
});

// instantiate the aws dynamodb client
const docClient = new AWS.DynamoDB.DocumentClient();


// POST /auth/login route - returns a JWT
router.post('/login', (req, res) => {
  console.log('In the POST /auth/login route');
  console.log(req.body);

  // manually querying for a specific known user.
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
        const token = jwt.sign(data.Item.password, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24 // 24 hours in seconds
        })
        res.send({ token: token});
    }
  });

});

// TODO: Might have to write sql query directly for dynamoDB. Should be a post route
router.get('/data', (req, res)=> {


})

module.exports = router;