import type { UIMessage } from "ai";

import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "@/db/helpers/timestamps";
import { id } from "@/db/helpers/id";

export const chatTable = sqliteTable("chats", {
  id,
  title: text("title"),
  ...timestamps,
});

export const messageTable = sqliteTable("messages", {
  id,
  role: text("role", { enum: ["system", "user", "assistant"] }).notNull(),
  metadata: text("metadata", { mode: "json" }),
  parts: text("parts", { mode: "json" }).notNull().$type<UIMessage["parts"]>(),
  chatId: text("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),
  ...timestamps,
});
