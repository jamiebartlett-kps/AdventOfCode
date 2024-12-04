import { GoogleGenerativeAI, } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

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

        const chatSession = model.startChat({generationConfig});
        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    }
}

export default geminiService;