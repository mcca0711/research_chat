// server.js
import serverless from 'serverless-http';
import app from './api/index.ts'; // Adjust the import path as needed

// Wrap the Express app with serverless-http
export const handler = serverless(app);

require('dotenv').config();
console.log("Loaded environment variables:", process.env.OPENAI_API_KEY);

const express = require('express');
const path = require('path');
const chatRouter = require('./api').default;
console.log('Chat router mounted');

const serverless = require('serverless-http');
const cors = require('cors'); // Import the cors package

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/', chatRouter);

// Export the app as a serverless function
module.exports.handler = serverless(app);

