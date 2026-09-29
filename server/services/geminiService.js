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

const generateCodingProblems = async (topic, difficulty, count, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert DSA problem generator.
Generate exactly ${count} unique programming problems about "${topic}".
Difficulty: ${difficulty}.

Requirements:
1. Problems must be suitable for coding practice.
2. Do not generate duplicate problems.
3. Include difficulty (Easy, Medium, Hard).
4. Include a clear problem description.
5. Include examples (input, output, explanation).
6. Include constraints.
7. "starterCode": Provide ONLY the empty class/function template for the user to write their logic (exactly like LeetCode). Do NOT include main functions or I/O parsing.
8. "driverCode": Provide the hidden execution boilerplate. It MUST read from stdin, call the user's function, and print the result. It MUST contain the exact string '// USER_CODE_HERE' where the user's code will be injected.
9. Include public test cases (hidden: false). Each testcase input must be exactly what is passed to stdin.
10. Include hidden test cases (hidden: true) covering edge cases. Expected output must be exactly what is printed to stdout.
11. Make expected outputs deterministic.
12. Return ONLY valid JSON with this schema:
{
  "problems": [
    {
      "title": "String",
      "topic": "String",
      "difficulty": "String",
      "description": "String",
      "examples": [{ "input": "String", "output": "String", "explanation": "String" }],
      "constraints": ["String"],
      "starterCode": { "javascript": "String", "java": "String", "python": "String", "cpp": "String" },
      "driverCode": { "javascript": "String", "java": "String", "python": "String", "cpp": "String" },
      "testCases": [{ "input": "String", "expectedOutput": "String", "hidden": Boolean }]
    }
  ]
}
Do not return markdown. Do not include explanations outside the JSON. Starter code must compile for the requested language.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
      });

      let responseText = response.text || "";
      const startIndex = responseText.indexOf("{");
      const endIndex = responseText.lastIndexOf("}");
      
      if (startIndex !== -1 && endIndex !== -1) {
        responseText = responseText.substring(startIndex, endIndex + 1);
      }
      
      const parsed = JSON.parse(responseText);
      if (!parsed.problems || parsed.problems.length !== parseInt(count)) {
          throw new Error("Invalid number of problems generated");
      }
      return parsed.problems;
    } catch (error) {
      console.error(`Gemini Coding API Error (Attempt ${attempt}/${retries}):`, error.message);
      if (attempt === retries) throw new Error(`Failed to generate coding problems: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
    }
  }
};

const generateCodingHint = async (problemDescription, userCode, language) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are a helpful coding tutor. 
Problem: ${problemDescription}
User's Code (${language}):
${userCode}

Provide a progressive hint to help the user solve the problem. Do NOT reveal the full solution. Focus on what they are missing or doing wrong. Keep it to 2-3 sentences max.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });
    return response.text || "Try rethinking your approach based on the constraints.";
  } catch (error) {
    return "I'm having trouble generating a hint right now. Try reviewing the problem examples carefully!";
  }
};

const generateCodingExplanation = async (problemDescription, userCode, language) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert software engineer.
Problem: ${problemDescription}
User's Code (${language}):
${userCode}

Explain the solution. Include:
1. Approach/Algorithm
2. Time Complexity
3. Space Complexity
4. Why this works.
Be concise and clear.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });
    return response.text || "Great job solving the problem!";
  } catch (error) {
    return "Great job! (Explanation currently unavailable due to an API error).";
  }
};

export { generateQuestions, generateChatResponse, generateCodingProblems, generateCodingHint, generateCodingExplanation };
