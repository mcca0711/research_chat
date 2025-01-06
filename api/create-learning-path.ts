// api/create-learning-path.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key in environment variables");
}

// Hardcoded profiles with educational attributes
const learnerProfiles = {
  john: {
    name: "John",
    age: 21,
    gender: "Male",
    traits: "Autism Spectrum, Sensory Sensitivities",
    learningStyle: "Visual",
    strengths: "Analytical Thinking",
    interests: "Science, Coding",
    challenges: "Group Work",
  },
  emma: {
    name: "Emma",
    age: 24,
    gender: "Female",
    traits: "Autism Spectrum, High Masking Skills",
    learningStyle: "Multimodal",
    strengths: "Creativity",
    interests: "Music, Design",
    challenges: "Deadlines",
  },
  liam: {
    name: "Liam",
    age: 19,
    gender: "Male",
    traits: "Autism Spectrum, Focus Challenges",
    learningStyle: "Kinesthetic",
    strengths: "Practical Problem-Solving",
    interests: "Mechanics, Outdoors",
    challenges: "Abstract Topics",
  },
  sophie: {
    name: "Sophie",
    age: 23,
    gender: "Female",
    traits: "Autism Spectrum, Hyperfocus Abilities",
    learningStyle: "Auditory",
    strengths: "Memorization",
    interests: "History, Literature",
    challenges: "Inconsistent Feedback",
  },
  alex: {
    name: "Alex",
    age: 28,
    gender: "Male",
    traits: "Autism Spectrum, Sensory Seeking",
    learningStyle: "Exploratory",
    strengths: "Logical Reasoning",
    interests: "Math, Philosophy",
    challenges: "Fast-Paced Learning",
  },
};

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { profileName } = req.body;

    if (!profileName || !(profileName in learnerProfiles)) {
      return res
        .status(400)
        .json({ error: "Invalid profile name. Please select a valid profile." });
    }

    const profile = learnerProfiles[profileName as keyof typeof learnerProfiles];
    const mobyDickContent = `
      Moby Dick is a novel by Herman Melville. It tells the story of Ishmael's adventures aboard the whaling ship Pequod, commanded by Captain Ahab.
      The novel explores themes of obsession, revenge, and humanity's place in nature.
    `;

    const systemPrompt = `
      You are a learning assistant generating a personalized learning path for the following learner:
      Profile:
      Name: ${profile.name}
      Age: ${profile.age}
      Gender: ${profile.gender}
      Traits: ${profile.traits}
      Learning Style: ${profile.learningStyle}
      Strengths: ${profile.strengths}
      Interests: ${profile.interests}
      Challenges: ${profile.challenges}
      
      Use the content of "Moby Dick" to create a tailored learning path that addresses their educational needs, strengths, and challenges.
    `;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemPrompt }],
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const learningPath = response.data.choices?.[0]?.message?.content;

    if (!learningPath || typeof learningPath !== "string") {
      return res.status(500).json({ error: "Failed to generate a valid learning path." });
    }

    return res.status(200).json({ learningPath });
  } catch (error: any) {
    console.error("Error in create-learning-path.ts:", error.response?.data || error.message);
    return res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
};
