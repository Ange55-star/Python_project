
import { GoogleGenAI, Type } from "@google/genai";
import { CodeAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePythonCode = async (code: string): Promise<CodeAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this Python code for a To-Do List project. 
    The project requires: Adding, Listing, Completing, and Deleting tasks using a list of dictionaries.
    
    Code to analyze:
    \`\`\`python
    ${code}
    \`\`\`
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          errors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of syntax errors or logic bugs found.",
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Improvements or missing requirements.",
          },
          conceptsUsed: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Python concepts identified (e.g., loops, dicts, functions).",
          },
        },
        required: ["errors", "suggestions", "conceptsUsed"],
      },
    },
  });

  try {
    return JSON.parse(response.text || '{}') as CodeAnalysis;
  } catch (e) {
    return { errors: ["Failed to parse analysis"], suggestions: [], conceptsUsed: [] };
  }
};

export const getTutorHint = async (message: string, code: string, history: {role: string, parts: any[]}[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an expert Python Tutor helping a student build a To-Do List console app. 
      The student must use: Lists, Dictionaries, Tuples, Strings, Loops, Conditions, and Functions.
      Language of communication: French (Français).
      Be encouraging and pedagogical. Don't just give the whole solution; explain the logic.
      The current code context is provided in the prompt.`,
    }
  });

  const response = await chat.sendMessage({
    message: `Current code:\n${code}\n\nStudent message: ${message}`
  });

  return response.text;
};
