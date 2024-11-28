require('dotenv').config();
const express = require('express');
const path = require('path');
const chatRouter = require('./api');
const serverless = require('serverless-http');
const cors = require('cors'); // Import the cors package

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/', chatRouter);

// Export the app as a serverless function
module.exports.handler = serverless(app);

