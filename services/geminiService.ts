import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizData, QuizQuestion, ChatMessage } from "../types";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove Data-URL declaration (e.g. "data:application/pdf;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = error => reject(error);
  });
};

const getQuizResponseSchema = (): Schema => {
  return {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A short, catchy title for the quiz based on the content.",
      },
      questions: {
        type: Type.ARRAY,
        description: "List of multiple choice questions generated from the content.",
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: {
              type: Type.STRING,
              description: "The question stem.",
            },
            options: {
              type: Type.ARRAY,
              description: "An array of 4 possible answers.",
              items: { type: Type.STRING }
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: "The index (0-3) of the correct answer in the options array.",
            },
            explanation: {
              type: Type.STRING,
              description: "A brief explanation of why the correct answer is correct.",
            }
          },
          required: ["questionText", "options", "correctAnswerIndex", "explanation"],
        },
      },
    },
    required: ["title", "questions"],
  };
};

export const generateQuizFromFile = async (
  file: File, 
  numQuestions: number
): Promise<QuizData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToBase64(file);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data
          }
        },
        {
          text: `Generate a multiple-choice quiz with exactly ${numQuestions} questions based on this document. Ensure the questions test understanding of key concepts. The difficulty should be moderate.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: getQuizResponseSchema(),
      temperature: 0.4,
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");

  return JSON.parse(text) as QuizData;
};

export const generateQuizFromText = async (
  textData: string,
  numQuestions: number
): Promise<QuizData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          text: `Here is the source text: "${textData.substring(0, 30000)}..." \n\n Generate a multiple-choice quiz with exactly ${numQuestions} questions based on the text above. Ensure the questions test understanding of key concepts. The difficulty should be moderate.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: getQuizResponseSchema(),
      temperature: 0.4,
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");

  return JSON.parse(text) as QuizData;
};

export const chatWithMaster = async (
  quizData: QuizData,
  history: ChatMessage[],
  userMessage: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing");

    const ai = new GoogleGenAI({ apiKey });

    // Convert internal message format to API format
    const apiHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Construct a context string representing the entire quiz
    const quizContext = `
      Quiz Title: ${quizData.title}
      
      Questions Reference:
      ${quizData.questions.map((q, i) => `
        Q${i+1}: ${q.questionText}
        Options: ${q.options.map((o, idx) => `${idx+1}. ${o}`).join(', ')}
        Correct Answer: ${q.options[q.correctAnswerIndex]}
        Explanation: ${q.explanation}
      `).join('\n\n')}
    `;

    const systemInstruction = `
      You are "Master", a wise and helpful AI Mentor. 
      The student has just completed the quiz titled "${quizData.title}".
      
      Here is the full context of the quiz they took:
      ${quizContext}
      
      Your goal is to help the student understand the concepts covered in the quiz.
      - The student may ask about specific questions (e.g., "Why is Q3 answer C?").
      - Or they may ask general questions about the topic.
      - If they are confused, explain the logic clearly using the provided explanations as a base.
      - Provide extra interesting facts or context to broaden their knowledge.
      - Keep your tone encouraging, scholarly, yet accessible.
      - Keep responses concise (under 150 words) unless asked for deep detail.
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: apiHistory
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I'm having trouble connecting right now.";

  } catch (error) {
    console.error("Error in chat:", error);
    return "Sorry, I couldn't process that request.";
  }
};