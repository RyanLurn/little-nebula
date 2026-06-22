import { setResponseStatus } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { serializeError } from "serialize-error";
import { z } from "zod";

import type { FallbackErrorCode } from "@/types/app-error";
import type { Result, Err, Ok } from "@/types/result";

import { messageTable, chatTable } from "@/db/schema/chat";
import { HTTP_STATUS } from "@/utils/http-status";
import { logger } from "@/lib/logger";
import { db } from "@/db";

export const createNewChat = createServerFn({ method: "POST", strict: false })
  .validator(
    z.object({
      input: z.string().min(1),
    })
  )
  .handler(async ({ data }): Promise<Result<string, FallbackErrorCode>> => {
    try {
      const id = Bun.randomUUIDv7();
      await db.insert(chatTable).values({ id });
      await db
        .insert(messageTable)
        .values({
          role: "user",
          parts: [{ type: "text", text: data.input }],
          chatId: id,
        })
        .returning();

      const ok: Ok<string> = {
        success: true,
        data: id,
      };

      logger.trace({
        input: data,
        process: "createNewChat server function",
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
  });
