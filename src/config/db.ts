import "@tanstack/react-start/server-only";
import { z } from "zod";

import { env } from "@/config/env";

export const dbConfigValidator = z.object({
  SQLITE_FILE_PATH:
    env.NODE_ENV === "development" || env.NODE_ENV === "testing"
      ? z.string().min(1)
      : z.string().min(1).catch("./local.sqlite"),
});

export const dbConfig = dbConfigValidator.parse(process.env);
