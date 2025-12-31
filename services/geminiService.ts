
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CodeAnalysis, ChatMessage } from "../types";

// Initialisation stricte selon les règles de l'API Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Analyse le code Python de l'utilisateur par rapport aux exigences du projet.
 * Utilise gemini-3-pro-preview pour des tâches de raisonnement complexes.
 */
export const analyzePythonCode = async (code: string, requirements: string): Promise<CodeAnalysis> => {
  const prompt = `Tu es un expert Python. Analyse ce code pour un projet de To-Do List.
  
  Code à analyser:
  \`\`\`python
  ${code}
  \`\`\`
  
  Objectifs du projet:
  ${requirements}

  Vérifie les erreurs de syntaxe, suggère des améliorations et identifie quels IDs d'objectifs sont remplis.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          errors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Erreurs de syntaxe ou bugs logiques."
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Conseils pour améliorer le code."
          },
          conceptsUsed: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Concepts Python identifiés (ex: dict, list, while)."
          },
          completedRequirementIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Liste des IDs d'objectifs validés par ce code."
          }
        },
        required: ["errors", "suggestions", "conceptsUsed", "completedRequirementIds"]
      }
    }
  });

  try {
    // Accès à .text en tant que propriété (non-méthode)
    const text = response.text || '{}';
    return JSON.parse(text) as CodeAnalysis;
  } catch (e) {
    console.error("Parsing failed", e);
    return { errors: ["Erreur d'analyse"], suggestions: [], conceptsUsed: [], completedRequirementIds: [] };
  }
};

/**
 * Récupère un conseil du tuteur IA. 
 * ChatMessage est importé pour typer correctement l'historique de chat.
 */
export const getTutorHint = async (message: string, code: string, history: ChatMessage[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Tu es un tuteur Python bienveillant. 
      Le projet est une To-Do List console. 
      Utilise le code actuel pour guider l'élève sans lui donner la réponse complète.
      Explique les concepts (listes, dictionnaires, boucles).
      Réponds en Français.`,
    }
  });

  // Utilisation de sendMessage avec le paramètre message obligatoire
  const response: GenerateContentResponse = await chat.sendMessage({
    message: `Code actuel:\n${code}\n\nQuestion de l'élève: ${message}`
  });

  return response.text;
};
