import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// External API Data Types
export const dramaSchema = z.object({
  id: z.string(),
  name: z.string(),
  cover: z.string(),
  chapterCount: z.number(),
  introduction: z.string(),
});

export type Drama = z.infer<typeof dramaSchema>;

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    isMore: z.boolean(),
    book: z.array(dramaSchema),
  }),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;

// Basic users table in case we need it later
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
