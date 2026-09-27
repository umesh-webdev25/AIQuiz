import { GoogleGenAI } from '@google/genai';

const generateQuestions = async (topic, difficulty, count) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `Generate a multiple choice quiz about "${topic}" at a ${difficulty} difficulty level.
You must return exactly ${count} questions.
Output ONLY a JSON array with this exact structure, nothing else:
[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
]
Do NOT wrap the response in markdown code blocks like \`\`\`json. Return raw JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
        });

        let responseText = response.text || '';
        
        // Log the raw response for debugging purposes
        console.log("Raw Gemini Response:", responseText);

        // Try to find JSON array brackets if there is extra text
        const startIndex = responseText.indexOf('[');
        const endIndex = responseText.lastIndexOf(']');
        
        if (startIndex !== -1 && endIndex !== -1) {
            responseText = responseText.substring(startIndex, endIndex + 1);
        }
        
        return JSON.parse(responseText);
    } catch (error) {
        console.error('Gemini API Error details:', error);
        throw new Error('Failed to generate quiz questions from AI.');
    }
};

export { generateQuestions };
