import "@tanstack/react-start/server-only";
import { drizzle } from "drizzle-orm/bun-sqlite";

import { dbConfig } from "@/config/db";

export const db = drizzle(dbConfig.SQLITE_FILE_PATH);
