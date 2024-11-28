import express from 'express';
import axios from 'axios';

const app = express();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure this is set in your environment

app.use(express.json());

app.post('/', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo", // Use the correct model
            messages: [
                { role: "user", content: userMessage } // Format the message correctly
            ],
            max_tokens: 150 // Adjust as needed
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ reply: response.data.choices[0].message.content }); // Adjusted to match the response structure
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Error communicating with OpenAI API' });
    }
});

export default app;
