import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { serializeError } from "serialize-error";
import { eq } from "drizzle-orm";
import { z } from "zod";

import type { SelectedMessage } from "@/db/types/inferred";
import type { FallbackErrorCode } from "@/types/app-error";
import type { Result, Err, Ok } from "@/types/result";

import { HTTP_STATUS } from "@/utils/http-status";
import { messageTable } from "@/db/schema/chat";
import { logger } from "@/lib/logger";
import { db } from "@/db";

export const listMessages = createServerFn({ strict: false })
  .validator(z.object({ id: z.uuidv7() }))
  .handler(
    async ({ data }): Promise<Result<SelectedMessage[], FallbackErrorCode>> => {
      try {
        const messages = await db
          .select()
          .from(messageTable)
          .where(eq(messageTable.chatId, data.id));

        const ok: Ok<SelectedMessage[]> = {
          success: true,
          data: messages,
        };

        logger.trace({
          input: data,
          process: "listMessages server function",
          output: ok,
          exception: null,
        });

        return ok;
      } catch (error) {
        setResponseStatus(
          HTTP_STATUS.INTERNAL_SERVER_ERROR.code,
          HTTP_STATUS.INTERNAL_SERVER_ERROR.text
        );

        const err: Err<FallbackErrorCode> = {
          success: false,
          error: {
            code: "FALLBACK_ERROR",
            message: "Something went wrong.",
            retryable: false,
          },
        };

        logger.error({
          input: data,
          process: "listMessages server function",
          output: null,
          exception: { ...err, cause: serializeError(error) },
        });

        return err;
      }
    }
  );
