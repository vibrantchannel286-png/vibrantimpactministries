import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FALLBACK_WORDS = [
  "The Lord is your shepherd; you shall not want. He makes you lie down in green pastures.",
  "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
  "For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.",
  "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?",
  "But those who hope in the Lord will renew their strength. They will soar on wings like eagles."
];

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const status = error?.status || error?.error?.code;
    const isRetryable = status >= 500 && status < 600;

    if (retries > 0 && isRetryable) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const getPropheticWord = async (mood: string = "hopeful", theme: string = ""): Promise<string> => {
  return withRetry(async () => {
    try {
      const themeContext = theme ? ` Our theme for this month is "${theme}". ` : "";
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a short, powerful prophetic word of encouragement and a relevant Bible verse for someone feeling ${mood}.${themeContext} Ensure the prophetic word aligns with the spiritual essence of the theme if provided. Keep it under 60 words. Do not use markdown headers, just text.`,
      });
      return response.text || FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
    } catch (error: any) {
      console.warn("Gemini Quota/Error - Using Fallback Word");
      return FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
    }
  });
};

export const askVimAssistant = async (query: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]): Promise<string> => {
  return withRetry(async () => {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are the VIM Digital Usher, a helpful AI assistant for Vibrant Impact Ministries (VIM). 
          The lead pastor is Prophet Valentine Ifedayo. 
          VIM is located at Ughele Junction, along Ado Road, Akure, Ondo State. 
          Service times: Sunday Glory Service (9 AM), Tuesday Deliverance (9 AM), Friday Youth Fellowship (4 PM), Fire Night Vigil (Last Friday, 10 PM).
          Be warm, faith-filled, and authoritative in the Word of God. Always offer to pray if someone shares a problem.`
        },
        history: history
      });
      
      const response = await chat.sendMessage({ message: query });
      return response.text || "I'm here to help you grow in faith. How can I assist you today?";
    } catch (error) {
      return "I'm currently meditating on the Word (experiencing high traffic). I'll be back in a moment to assist you! Feel free to explore our service times below.";
    }
  });
};

export const getVisitGuide = async (lat?: number, lng?: number): Promise<{text: string, links: any[]}> => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "I am planning to visit Vibrant Impact Ministries at Ughele Junction, Ado Road, Akure. What are some good places to eat or landmarks nearby? Provide a warm guide for a Sunday visitor.",
        config: {
          tools: [{googleMaps: {}}],
          toolConfig: {
            retrievalConfig: {
              latLng: lat && lng ? { latitude: lat, longitude: lng } : { latitude: 7.2571, longitude: 5.2058 } 
            }
          }
        },
      });

      const text = response.text || "Welcome to Akure! VIM is centrally located at Ughele Junction, easy to find from any part of the city. We recommend arriving 15 minutes early to find good parking.";
      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { text, links };
    } catch (error) {
      return { 
        text: "Vibrant Impact Ministries is located at Ughele Junction, along Ado Road, Akure. The area is bustling and safe, with several local cafes nearby perfect for a post-service lunch. We can't wait to see you!", 
        links: [] 
      };
    }
  });
};