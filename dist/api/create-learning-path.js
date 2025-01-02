"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
// Load environment variables
dotenv_1.default.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key in environment variables');
}
exports.default = async (req, res) => {
    var _a, _b, _c, _d, _e;
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
        const sanitizedAsdType = (0, sanitize_html_1.default)(asdType.trim(), { allowedTags: [], allowedAttributes: {} });
        const sanitizedStoryText = (0, sanitize_html_1.default)(storyText.trim(), { allowedTags: [], allowedAttributes: {} });
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
        const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: systemPrompt }],
            max_tokens: 800,
        }, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const learningPath = (_c = (_b = (_a = response.data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        // Ensure response integrity
        if (!learningPath || typeof learningPath !== 'string') {
            return res.status(500).json({ error: 'Failed to generate a valid learning path.' });
        }
        // Send success response
        return res.status(200).json({ learningPath });
    }
    catch (error) {
        console.error('Error in create-learning-path.ts:', ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
        if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === 401) {
            return res.status(500).json({ error: 'Unauthorized: Check your OpenAI API key.' });
        }
        return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};
