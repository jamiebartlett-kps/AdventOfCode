import { GoogleGenerativeAI, } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs'

dotenv.config();

const defaultHistory = [
    {
      "role": "user",
      "parts": [
        {
          "text": "We're doing an Advent calendar of coding challenges, it's a few challenges each day. I want you to generate updates based on some JSON i'm going to give you of the users which have finished which challenges since the last message. I'll send you the first message in a minute with what style of response i'd like"
        }
      ]
    }
  ];

const chatHistoryLocation = process.env.CHAT_HISTORY_LOCATION;
const chatHistory = fs.existsSync(chatHistoryLocation) ? JSON.parse(fs.readFileSync(chatHistoryLocation, 'utf-8')) :defaultHistory;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const geminiService = {
    askQuestion: async (prompt) => {
        const generationConfig = {
            temperature: 2,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain"
        };

        const chatSession = model.startChat({history: chatHistory, generationConfig});
        const result = await chatSession.sendMessage(prompt);
        fs.writeFileSync(chatHistoryLocation, JSON.stringify(chatHistory, null, 2), 'utf8');

        return result.response.text();
    }
}

export default geminiService;