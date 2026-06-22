import "@tanstack/react-start/server-only";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";

const aiConfigValidator = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
  GROQ_API_KEY: z.string().min(1),
});

export const aiConfig = aiConfigValidator.parse(process.env);

export const googleGenerativeAIProvider = createGoogleGenerativeAI({
  apiKey: aiConfig.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const groqProvider = createGroq({
  apiKey: aiConfig.GROQ_API_KEY,
});
