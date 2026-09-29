import { GoogleGenAI } from "@google/genai";

const generateQuestions = async (topic, difficulty, count, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
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
        model: "gemini-3.5-flash-lite",
        contents: prompt,
      });

      let responseText = response.text || "";

      // Log the raw response for debugging purposes
      console.log("Raw Gemini Response:", responseText);

      // Try to find JSON array brackets if there is extra text
      const startIndex = responseText.indexOf("[");
      const endIndex = responseText.lastIndexOf("]");

      if (startIndex !== -1 && endIndex !== -1) {
        responseText = responseText.substring(startIndex, endIndex + 1);
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error(
        `Gemini API Error details (Attempt ${attempt}/${retries}):`,
        error.message,
      );

      // If we've exhausted retries, throw the error
      if (attempt === retries) {
        // Pass the actual error message so we can see if it's 503 or something else
        throw new Error(
          `Failed to generate quiz questions from AI: ${error.message}`,
        );
      }

      // Wait before retrying (exponential backoff: 1s, 2s, 4s...)
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`Waiting ${delay}ms before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const generateChatResponse = async (message) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `You are a helpful, friendly AI assistant for a quiz application called "AI Quiz Master". Keep your answers concise and conversational. The user says: "${message}"`,
    });
    return response.text || "I'm sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Chat API Error:", error.message);
    return "I'm experiencing some technical difficulties right now. Please try again later.";
  }
};

export { generateQuestions, generateChatResponse };
