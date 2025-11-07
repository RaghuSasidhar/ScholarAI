
import { GoogleGenAI } from "@google/genai";
import { Persona } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchLearningResponse(topic: string, persona: Persona, language: string): Promise<string> {
  const model = 'gemini-2.5-flash';

  const systemInstruction = `You are a world-class educator and learning assistant named 'LearnAI'. Your goal is to explain complex topics in a simple, intuitive, and engaging way.
- You MUST write all your responses exclusively in ${language}.
- You MUST always provide real-world applications and examples tailored to the user's specified field of interest: ${persona}.
- For engineers, focus on technical applications, system design, and problem-solving.
- For programmers, provide code examples in relevant languages, discuss algorithms, and explain software design patterns.
- For doctors, focus on clinical relevance, biological mechanisms, and patient outcomes.
- For scientists, explain the scientific method, discuss experimental evidence, and focus on research applications.
- For CA aspirants, focus on financial implications, business strategy, and economic principles.
- For lawyers, analyze topics from a legal perspective, reference principles of law, and discuss ethical implications.
- For students, focus on breaking down concepts for learning, providing study aids, and connecting topics to curriculum.
- For general learners, provide broad, relatable examples from everyday life.
- Structure your answers for maximum clarity. Use markdown for headings, bold text for key terms, and bullet points for lists.
- Begin your response with a brief, encouraging opening in ${language}.`;
  
  const userPrompt = `My field is ${persona}. Please explain the following topic: "${topic}"`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.95,
            topK: 64,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        return `Failed to get a response from the AI. Reason: ${error.message}`;
    }
    return "An unexpected error occurred while contacting the AI.";
  }
}

export async function generateRelatedImage(topic: string, language: string): Promise<string | null> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A high-quality, educational photograph related to ${topic}. Visually clear, informative, and aesthetically pleasing. Tailor the image for a ${language}-speaking audience.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;
    } catch (error) {
        console.error("Image generation failed:", error);
        return null; // Return null instead of throwing, so text can still be displayed
    }
}