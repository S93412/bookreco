import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  genres: text("genres").array().notNull(),
  rating: text("rating").notNull(),
  pages: integer("pages").notNull(),
  published: text("published").notNull(),
  isbn: text("isbn").notNull(),
  language: text("language").notNull(),
});

export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  bookId: integer("book_id").notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  genres: text("genres").array().notNull(),
});

export const bookReviews = pgTable("book_reviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const readingProgress = pgTable("reading_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  pagesRead: integer("pages_read").notNull().default(0),
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertBookSchema = createInsertSchema(books).omit({ id: true });
export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({ id: true });
export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({ id: true });
export const insertBookReviewSchema = createInsertSchema(bookReviews).omit({ id: true, createdAt: true });
export const insertReadingProgressSchema = createInsertSchema(readingProgress).omit({ id: true, lastUpdated: true });

export type InsertBook = z.infer<typeof insertBookSchema>;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;
export type InsertBookReview = z.infer<typeof insertBookReviewSchema>;
export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;

export type Book = typeof books.$inferSelect;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;
export type BookReview = typeof bookReviews.$inferSelect;
export type ReadingProgress = typeof readingProgress.$inferSelect;
