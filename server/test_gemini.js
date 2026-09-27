import dotenv from 'dotenv';
import { generateQuestions } from './services/geminiService.js';

dotenv.config();

async function run() {
    console.log("Testing Gemini API with Key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
    try {
        const questions = await generateQuestions("History", "Easy", 2);
        console.log("Questions generated successfully:");
        console.log(JSON.stringify(questions, null, 2));
    } catch (err) {
        console.error("Test failed:");
        console.error(err);
    }
}

run();
