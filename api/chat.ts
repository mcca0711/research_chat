// api/chat.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, asdType, documentContent } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!asdType) {
    return res.status(400).json({ error: 'ASD type is required' });
  }

  try {
    const systemPrompt = `
      You are an assistant specialized in helping individuals with ASD: ${asdType}.
      ${documentContent ? `Consider the following document content for context: ${documentContent}` : ''}
    `;
    const userPrompt = `User says: ${message}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ reply: response.data.choices[0].message.content });
  } catch (error: any) {
    console.error('OpenAI Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error communicating with OpenAI API' });
  }
};
