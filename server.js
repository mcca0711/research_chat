require('dotenv').config();
const express = require('express');
const path = require('path');
const chatRouter = require('./api/chat');
const serverless = require('serverless-http');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/chat', chatRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app as a serverless function
module.exports.handler = serverless(app);

