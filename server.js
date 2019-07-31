'use strict';

const express = require('express');
const AWS = require('aws-sdk');
const expressJwt = require('express-jwt');
const request = require('request');
const cors = require('cors');


// env variables
require('dotenv').config();

// app/middleware setup
const app = express();
app.use(express.urlencoded({extended: false}));

//Home route
app.get('/', (req, res)=> {
  res.send('Home page stub route.')
})

//About  us route
app.get('/aboutus', (req, res) => {
  res.send('Stub route for about us page')
})

//Route to turn on autowater
app.get('/auto_water_on', (req, res) => {
  const waterOnURL = "https://re1q4laqtg.execute-api.us-west-2.amazonaws.com/auto_water_on"

  request(waterOnURL, (error, res, body)=> {
    if(error) {
      console.log(error)
    } 
  })
  res.status(200).send("Successfully turned auto water ON")
});


//Route to turn off autowater
app.get('/auto_water_off', (req, res) => {
  const waterOffURL = "https://6gnaoz78ye.execute-api.us-west-2.amazonaws.com/auto_water_off"
  
  request(waterOffURL, (error, req,res) => {
    if(error) {
      console.log(error)
    } 
  })
  res.status(200).send("Successfully turned auto water OFF")
})


//Route to turn on pump once
app.get('/water_once', (req, res) => {
  const waterOnceURL = "https://n2std8pxaa.execute-api.us-west-2.amazonaws.com/water_once"

  request(waterOnceURL, (error, req, res) => {
    if(error) {
      console.log(error)
    } 
  })
  res.status(200).send("Successfully Watered once!")
})


//Route to login
app.use('/auth', expressJwt({
  secret: process.env.JWT_SECRET,
  getToken: fromRequest
}).unless({
  path: [{ url: '/auth/login', methods: ['POST'], url: '/auth/data', methods: ['GET'] }]
}), require('./controllers/auth'));

// Helper function: This allows our server to parse the incoming token from the client
// This is being run as middleware, so it has access to the incoming request
function fromRequest(req){
  console.log('hello', req.body);
  if(req.body.headers &&
    req.body.headers.Authorization &&
    req.body.headers.Authorization.split(' ')[0] === 'Bearer'){
      return req.body.headers.Authorization.split(' ')[1];
  }
  return null;
}

app.listen(process.env.PORT || 3000, ()=>{
  console.log("🎵 Now listening to the smooth sounds of port 3000🍺  🎵")
});

