import type { messageTable } from "@/db/schema/chat";

export type SelectedMessage = typeof messageTable.$inferSelect;
