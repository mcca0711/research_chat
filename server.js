// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Import your index.ts
const chatRouter = require('./api/index.ts').default;

const app = express();
app.use(cors());
app.use(express.json());

// 1) MOUNT /api ROUTES FIRST
app.use('/api', chatRouter);

// 2) SERVE STATIC FILES AFTER
app.use(express.static(path.join(__dirname, 'public')));

// IMPORTANT: Export the app directly (no serverless-http)
module.exports = app;
