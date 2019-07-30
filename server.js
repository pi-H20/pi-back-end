'use strict';

const express = require('express');
const AWS = require('aws-sdk');
const expressJwt = require('express-jwt');

// env variables
require('dotenv').config();

// app/middleware setup
const app = express();
app.use(express.urlencoded({extended: false}));


app.get('/', (req, res)=> {
  res.send('Home page stub route.')
})
app.get('/aboutus', (req, res) => {
  res.send('Stub route for about us page')
})
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

