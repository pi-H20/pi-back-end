'user-strict'

const express = require('express');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const router = express.Router();
const bcrypt = require('bcryptjs');


//middleware
require('dotenv').config();

// configure aws
AWS.config.update({
  "region": 'us-west-2',
  "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
  "accessKeyId": process.env.ACCESSKEYID,
  "secretAccessKey": process.env.SECRETKEYID
});

// instantiate the aws dynamodb client
const docClient = new AWS.DynamoDB.DocumentClient();

// POST /auth/login route - returns a JWT
router.post('/login', (req, res) => {
  console.log('In the POST /auth/login route');
  console.log(req);
  console.log(req.query);

  var params = {
    TableName: "PlantUsers",
    Key:{
      "email": req.query.email
    }
  };

  // using a .get call rather than .query since there's only one user
  docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        console.log(data.Item.password);
        // user found, check password
        bcrypt.compare(req.query.password, data.Item.password, (error, passwordsMatch) => {
          if(passwordsMatch){
              const token = jwt.sign(params.Key, process.env.JWT_SECRET, {
                  expiresIn: 60 * 60 * 24 // 24 hours (in seconds)
              });
              res.send({ token: token });
          } else {
              return res.status(401).send('Invalid Credentials');
          }
          if(error){
              console.log(`Error comparing password. ${error}`);
          }
      });
    }
  });

});

// as of now, the data being returned will be the user since we don't have watering history data yet.
router.get('/data', (req, res)=> {

  var params = {
    TableName: "WateringPlantTable",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: {
      "#status": "status"
    },
    ExpressionAttributeValues: {
        ":status": "low"
    }
  };

  docClient.query(params, function(err, data) {
    
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          console.log(data);
          res.send(data.Items);
      }
  });

 
  
});

// POST /auth/signup route - create a user in the DB and then log them in
router.post('/signup', (req, res) => {
  console.log(req.query)

    bcrypt.hash(req.query.password, 10, (error, hash) => {
      var params = {
        TableName: "PlantUsers",
        Item:{
            "email": req.query.email,
            "name": req.query.name,
            "password": hash
            
          }
        }
      docClient.put(params, function(err, data){
        if (err){
          console.log("unable to put item. Error:", JSON.stringify(err, null, 2))
        } else {
          console.log("Created new User");
          const token = jwt.sign(params.Item, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 // 24 hours (in seconds)
          });
          console.log(token)
          res.send({ token : token});
        }
      })
    })
  

});

module.exports = router;
