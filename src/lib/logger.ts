import "@tanstack/react-start/server-only";
import { type TransportSingleOptions, type LoggerOptions, pino } from "pino";

import { loggerConfig } from "@/config/logger";
import { env } from "@/config/env";

const fileTransport: TransportSingleOptions = {
  target: "pino/file",
  options: { destination: loggerConfig.FILE_TRANSPORT_DESTINATION },
};

const options: LoggerOptions = {
  level: loggerConfig.LOGGER_LEVEL,
  transport:
    env.NODE_ENV === "production"
      ? fileTransport
      : {
          targets: [
            {
              ...fileTransport,
              level: loggerConfig.FILE_TRANSPORT_LEVEL,
            },
            {
              target: "pino-pretty",
              level: loggerConfig.PRETTY_TRANSPORT_LEVEL,
            },
          ],
        },
};

export const logger = pino(options);
