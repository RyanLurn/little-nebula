import "@tanstack/react-start/server-only";

import type { Level } from "pino";

import { z } from "zod";

import { env } from "@/config/env";

export const logLevels: Level[] = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

export const logLevelValidator = z.enum(logLevels);

const floorLevel = env.NODE_ENV === "production" ? "info" : "debug";

export const loggerConfigValidator = z.object({
  LOGGER_LEVEL: logLevelValidator.default(floorLevel),
  FILE_TRANSPORT_LEVEL: logLevelValidator.default(floorLevel),
  FILE_TRANSPORT_DESTINATION:
    env.NODE_ENV === "production"
      ? z.string().min(1)
      : z
          .string()
          .min(1)
          .default(`./logs/${new Date().toISOString().split("T")[0]}.txt`),
  PRETTY_TRANSPORT_LEVEL:
    env.NODE_ENV === "production"
      ? logLevelValidator.catch("fatal")
      : logLevelValidator.default("warn"),
});

export const loggerConfig = loggerConfigValidator.parse(process.env);
