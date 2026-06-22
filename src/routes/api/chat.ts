import { convertToModelMessages, validateUIMessages, streamText } from "ai";
import { createFileRoute } from "@tanstack/react-router";

import { groqProvider } from "@/config/ai";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages: [] };
        const validatedMessages = await validateUIMessages({ messages });

        const streamTextResult = streamText({
          model: groqProvider("openai/gpt-oss-120b"),
          messages: await convertToModelMessages(messages),
          onFinish: (result) => {
            logger.trace({
              input: { validatedMessages },
              process: "POST /api/chat handler",
              output: result,
            });
          },
        });

        return streamTextResult.toUIMessageStreamResponse();
      },
    },
  },
});
