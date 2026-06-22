import "@tanstack/react-start/server-only";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const aiConfigValidator = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
});

export const aiConfig = aiConfigValidator.parse(process.env);

export const googleGenerativeAIProvider = createGoogleGenerativeAI({
  apiKey: aiConfig.GOOGLE_GENERATIVE_AI_API_KEY,
});
