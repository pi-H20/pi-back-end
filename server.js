'use strict';

require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const app = express();

// AWS.config.update({
//   region: 'us-west-2',
// });