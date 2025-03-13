import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserFavoriteSchema, insertUserPreferenceSchema, insertBookReviewSchema, insertReadingProgressSchema, Book } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { searchGoogleBooks, getBooksByCategory, getBookDetails, getPopularBooks } from "./externalApi";

const DEFAULT_USER_ID = "user123"; // For demo purposes

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all books
  app.get("/api/books", async (_req: Request, res: Response) => {
    try {
      const books = await storage.getAllBooks();
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  // Search books - now with Google Books API integration
  app.get("/api/books/search", async (req: Request, res: Response) => {
    try {
      const query = z.string().parse(req.query.q || "");
      const page = parseInt(req.query.page as string) || 0;
      const startIndex = page * 40; // 40 items per page
      
      // First try local storage
      let books = await storage.searchBooks(query);
      
      // If fewer than 10 results, search Google Books API
      if (books.length < 10) {
        const externalResults = await searchGoogleBooks(query, startIndex);
        
        // Combine results, with local results first
        const combinedBooks = [...books];
        
        // Add external books that don't duplicate local ones
        externalResults.books.forEach(book => {
          if (!combinedBooks.some(b => b.title === book.title && b.author === book.author)) {
            combinedBooks.push(book);
          }
        });
        
        return res.json({
          books: combinedBooks,
          totalItems: externalResults.totalItems,
          currentPage: page,
          itemsPerPage: 40
        });
      }
      
      return res.json({
        books,
        totalItems: books.length,
        currentPage: 0,
        itemsPerPage: books.length
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid search query" });
      }
      return res.status(500).json({ message: "Search failed" });
    }
  });

  // Filter books by genres
  app.get("/api/books/filter", async (req: Request, res: Response) => {
    try {
      const genres = z.array(z.string()).parse(req.query.genres);
      const books = await storage.filterBooksByGenres(genres);
      return res.json(books);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid genres parameter" });
      }
      return res.status(500).json({ message: "Failed to filter books" });
    }
  });

  // Get user's favorite books
  app.get("/api/favorites", async (_req: Request, res: Response) => {
    try {
      const favoriteBooks = await storage.getFavoriteBooks(DEFAULT_USER_ID);
      return res.json(favoriteBooks);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch favorite books" });
    }
  });

  // Add book to favorites
  app.post("/api/favorites", async (req: Request, res: Response) => {
    try {
      const favorite = insertUserFavoriteSchema.parse({
        userId: DEFAULT_USER_ID,
        bookId: req.body.bookId,
      });

      const newFavorite = await storage.addFavoriteBook(favorite);
      return res.status(201).json(newFavorite);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      return res.status(500).json({ message: "Failed to add book to favorites" });
    }
  });

  // Remove book from favorites
  app.delete("/api/favorites/:bookId", async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.bookId);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      await storage.removeFavoriteBook(DEFAULT_USER_ID, bookId);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Failed to remove book from favorites" });
    }
  });

  // Check if book is favorite
  app.get("/api/favorites/:bookId", async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.bookId);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const isFavorite = await storage.isFavoriteBook(DEFAULT_USER_ID, bookId);
      return res.json({ isFavorite });
    } catch (error) {
      return res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Update user preferences
  app.post("/api/preferences", async (req: Request, res: Response) => {
    try {
      const preferences = insertUserPreferenceSchema.parse({
        userId: DEFAULT_USER_ID,
        genres: req.body.genres,
      });

      const updatedPreferences = await storage.updateUserPreferences(preferences);
      return res.json(updatedPreferences);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid preferences format" });
      }
      return res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (_req: Request, res: Response) => {
    try {
      const preferences = await storage.getUserPreferences(DEFAULT_USER_ID);
      return res.json(preferences || { userId: DEFAULT_USER_ID, genres: [] });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Get recommended books
  app.get("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const recommendedBooks = await storage.getRecommendedBooks(DEFAULT_USER_ID, limit);
      return res.json(recommendedBooks);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // Get popular books with Google Books API integration
  app.get("/api/popular", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
      
      // Get popular books from local storage
      const localPopularBooks = await storage.getPopularBooks(limit);
      
      // If we have fewer than the limit/2, supplement with external API
      if (localPopularBooks.length < limit / 2) {
        const externalPopularBooks = await getPopularBooks(limit);
        
        // Combine books, prioritizing local ones
        const combinedBooks = [...localPopularBooks];
        
        // Add external books that don't duplicate local ones
        externalPopularBooks.forEach(book => {
          if (!combinedBooks.some(b => b.title === book.title && b.author === book.author) 
              && combinedBooks.length < limit) {
            combinedBooks.push(book);
          }
        });
        
        return res.json(combinedBooks);
      }
      
      return res.json(localPopularBooks);
    } catch (error) {
      console.error("Popular books fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch popular books" });
    }
  });

  // Get book by ID
  app.get("/api/books/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const book = await storage.getBookById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.json(book);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch book details" });
    }
  });

  // Get books by category with Google Books API integration
  app.get("/api/categories/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const page = parseInt(req.query.page as string) || 0;
      const startIndex = page * 40; // 40 books per page
      
      // Try fetching from local storage first
      let localBooks = await storage.getBooksByCategory(category);
      
      // If we don't have enough local books, supplement with Google Books API
      if (localBooks.length < 10) {
        const { books: externalBooks, totalItems } = await getBooksByCategory(category, startIndex);
        
        // Combine results, prioritizing local books
        const combinedBooks = [...localBooks];
        
        // Add external books that don't duplicate local ones
        externalBooks.forEach(book => {
          if (!combinedBooks.some(b => b.title === book.title && b.author === book.author)) {
            combinedBooks.push(book);
          }
        });
        
        return res.json({
          books: combinedBooks,
          totalItems: totalItems,
          currentPage: page,
          itemsPerPage: 40
        });
      }
      
      // If we have enough local books, just return those
      return res.json({
        books: localBooks,
        totalItems: localBooks.length,
        currentPage: 0,
        itemsPerPage: localBooks.length
      });
    } catch (error) {
      console.error("Category fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch books by category" });
    }
  });

  // Get reviews for a book
  app.get("/api/books/:bookId/reviews", async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.bookId);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const reviews = await storage.getBookReviews(bookId);
      return res.json(reviews);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Add a review for a book
  app.post("/api/books/:bookId/reviews", async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.bookId);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const review = insertBookReviewSchema.parse({
        userId: DEFAULT_USER_ID,
        bookId,
        rating: req.body.rating,
        comment: req.body.comment
      });

      const newReview = await storage.addBookReview(review);
      return res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid review data" });
      }
      return res.status(500).json({ message: "Failed to add review" });
    }
  });

  // Update a review
  app.put("/api/reviews/:reviewId", async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const reviewData = {
        rating: req.body.rating,
        comment: req.body.comment
      };

      const updatedReview = await storage.updateBookReview(reviewId, reviewData);
      return res.json(updatedReview);
    } catch (error) {
      if (error instanceof Error && error.message === "Review not found") {
        return res.status(404).json({ message: "Review not found" });
      }
      return res.status(500).json({ message: "Failed to update review" });
    }
  });

  // Delete a review
  app.delete("/api/reviews/:reviewId", async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      await storage.deleteBookReview(reviewId);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Get reviews by a user
  app.get("/api/user/reviews", async (_req: Request, res: Response) => {
    try {
      const reviews = await storage.getUserReviews(DEFAULT_USER_ID);
      return res.json(reviews);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  // Get reading progress for a book
  app.get("/api/books/:bookId/progress", async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.bookId);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const progress = await storage.getReadingProgress(DEFAULT_USER_ID, bookId);
      return res.json(progress || { userId: DEFAULT_USER_ID, bookId, pagesRead: 0, status: "not_started" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch reading progress" });
    }
  });

  // Update reading progress for a book
  app.post("/api/books/:bookId/progress", async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.bookId);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const progress = insertReadingProgressSchema.parse({
        userId: DEFAULT_USER_ID,
        bookId,
        pagesRead: req.body.pagesRead,
        status: req.body.status
      });

      const updatedProgress = await storage.updateReadingProgress(progress);
      return res.json(updatedProgress);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid progress data" });
      }
      return res.status(500).json({ message: "Failed to update reading progress" });
    }
  });

  // Get user's reading list with progress
  app.get("/api/user/reading-list", async (_req: Request, res: Response) => {
    try {
      const readingList = await storage.getUserReadingList(DEFAULT_USER_ID);
      return res.json(readingList);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch reading list" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
