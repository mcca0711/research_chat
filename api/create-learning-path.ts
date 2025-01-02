// api/create-learning-path.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import dotenv from 'dotenv';
import sanitizeHtml from 'sanitize-html';

// Load environment variables
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key in environment variables');
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Restrict to POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { asdType, storyText } = req.body;

    // Input validation
    if (!asdType || typeof asdType !== 'string') {
      return res.status(400).json({ error: 'Invalid ASD type. Please select a valid option.' });
    }

    if (!storyText || typeof storyText !== 'string') {
      return res.status(400).json({ error: 'Invalid story text. Please upload a valid document.' });
    }

    // Sanitize inputs to prevent injection attacks
    const sanitizedAsdType = sanitizeHtml(asdType.trim(), { allowedTags: [], allowedAttributes: {} });
    const sanitizedStoryText = sanitizeHtml(storyText.trim(), { allowedTags: [], allowedAttributes: {} });

    // Build system prompt for OpenAI
    const systemPrompt = `
      You are a learning path assistant specialized for individuals with ASD (${sanitizedAsdType}).
      Based on the provided content, generate a detailed and dynamic learning path tailored to the ASD type.
      Here is the content:
      """
      ${sanitizedStoryText}
      """
      Consider the user's unique challenges and strengths related to the specified ASD type.
    `;

    // Communicate with OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: systemPrompt }],
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const learningPath = response.data.choices?.[0]?.message?.content;

    // Ensure response integrity
    if (!learningPath || typeof learningPath !== 'string') {
      return res.status(500).json({ error: 'Failed to generate a valid learning path.' });
    }

    // Send success response
    return res.status(200).json({ learningPath });
  } catch (error: any) {
    console.error('Error in create-learning-path.ts:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Unauthorized: Check your OpenAI API key.' });
    }

    return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
};
