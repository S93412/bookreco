import { 
  books, 
  userFavorites, 
  userPreferences,
  bookReviews,
  readingProgress,
  type Book, 
  type InsertBook, 
  type UserFavorite, 
  type InsertUserFavorite, 
  type UserPreference, 
  type InsertUserPreference,
  type BookReview,
  type InsertBookReview,
  type ReadingProgress,
  type InsertReadingProgress
} from "@shared/schema";

export interface IStorage {
  // Book operations
  getAllBooks(): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  searchBooks(query: string): Promise<Book[]>;
  filterBooksByGenres(genres: string[]): Promise<Book[]>;
  getBooksByIds(ids: number[]): Promise<Book[]>;
  getBooksByCategory(category: string): Promise<Book[]>;
  
  // User favorites operations
  getFavoriteBooks(userId: string): Promise<Book[]>;
  addFavoriteBook(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFavoriteBook(userId: string, bookId: number): Promise<void>;
  isFavoriteBook(userId: string, bookId: number): Promise<boolean>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreference | undefined>;
  updateUserPreferences(preference: InsertUserPreference): Promise<UserPreference>;
  
  // Book reviews operations
  getBookReviews(bookId: number): Promise<BookReview[]>;
  addBookReview(review: InsertBookReview): Promise<BookReview>;
  updateBookReview(id: number, review: Partial<InsertBookReview>): Promise<BookReview>;
  deleteBookReview(id: number): Promise<void>;
  getUserReviews(userId: string): Promise<BookReview[]>;
  
  // Reading progress operations
  getReadingProgress(userId: string, bookId: number): Promise<ReadingProgress | undefined>;
  updateReadingProgress(progress: InsertReadingProgress): Promise<ReadingProgress>;
  getUserReadingList(userId: string): Promise<{book: Book, progress: ReadingProgress}[]>;
  
  // Recommendation operations
  getRecommendedBooks(userId: string, limit?: number): Promise<Book[]>;
  getPopularBooks(limit?: number): Promise<Book[]>;
}

export class MemStorage implements IStorage {
  private books: Map<number, Book>;
  private userFavorites: Map<string, Set<number>>;
  private userPreferences: Map<string, UserPreference>;
  private bookReviews: Map<number, BookReview[]>;
  private readingProgress: Map<string, Map<number, ReadingProgress>>;
  private currentBookId: number;
  private currentFavoriteId: number;
  private currentPreferenceId: number;
  private currentReviewId: number;
  private currentProgressId: number;

  constructor() {
    this.books = new Map();
    this.userFavorites = new Map();
    this.userPreferences = new Map();
    this.bookReviews = new Map();
    this.readingProgress = new Map();
    this.currentBookId = 1;
    this.currentFavoriteId = 1;
    this.currentPreferenceId = 1;
    this.currentReviewId = 1;
    this.currentProgressId = 1;
    
    // Add sample books data
    const sampleBooks: InsertBook[] = [
      {
        title: "The Night Circus",
        author: "Erin Morgenstern",
        description: "The circus arrives without warning. No announcements precede it. It is simply there, when yesterday it was not. Within the black-and-white striped canvas tents is an utterly unique experience full of breathtaking amazements. It is called Le Cirque des Rêves, and it is only open at night.\n\nBut behind the scenes, a fierce competition is underway—a duel between two young magicians, Celia and Marco, who have been trained since childhood expressly for this purpose by their mercurial instructors. Unbeknownst to them, this is a game in which only one can be left standing, and the circus is but the stage for a remarkable battle of imagination and will.",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["Fantasy", "Fiction", "Romance"],
        rating: "4.5",
        pages: 516,
        published: "September 13, 2011",
        isbn: "9780385534635",
        language: "English",
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it. All he knows is that he's been asleep for a very, very long time. And he's just been awakened to find himself millions of miles from home, with nothing but two corpses for company.",
        coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["Sci-Fi", "Adventure", "Fiction"],
        rating: "4.9",
        pages: 496,
        published: "May 4, 2021",
        isbn: "9780593135204",
        language: "English",
      },
      {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        description: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["Thriller", "Mystery", "Fiction"],
        rating: "4.5",
        pages: 336,
        published: "February 5, 2019",
        isbn: "9781250301697",
        language: "English",
      },
      {
        title: "Educated",
        author: "Tara Westover",
        description: "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara's older brothers became violent.",
        coverImage: "https://images.unsplash.com/photo-1603162578506-b0c09705a700?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["Memoir", "Biography", "Nonfiction"],
        rating: "4.0",
        pages: 334,
        published: "February 20, 2018",
        isbn: "9780399590504",
        language: "English",
      },
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
        coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["Fiction", "Philosophy", "Fantasy"],
        rating: "4.2",
        pages: 304,
        published: "September 29, 2020",
        isbn: "9780525559474",
        language: "English",
      },
      {
        title: "Where the Crawdads Sing",
        author: "Delia Owens",
        description: "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say. Sensitive and intelligent, she has survived for years alone in the marsh that she calls home, finding friends in the gulls and lessons in the sand.",
        coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["Fiction", "Mystery", "Literary"],
        rating: "4.7",
        pages: 384,
        published: "August 14, 2018",
        isbn: "9780735219090",
        language: "English",
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
        coverImage: "https://images.unsplash.com/photo-1554377740-a1cedf6f0121?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["Self-Help", "Nonfiction", "Psychology"],
        rating: "4.8",
        pages: 320,
        published: "October 16, 2018",
        isbn: "9780735211292",
        language: "English",
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        description: "In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions. Drawing on insights from biology, anthropology, paleontology and economics, he explores how the currents of history have shaped our human societies, the animals and plants around us, and even our personalities.",
        coverImage: "https://images.unsplash.com/photo-1602845860423-22c9add85358?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["History", "Nonfiction", "Science"],
        rating: "4.6",
        pages: 464,
        published: "February 10, 2015",
        isbn: "9780062316097",
        language: "English",
      },
      {
        title: "The Song of Achilles",
        author: "Madeline Miller",
        description: "Greece in the age of heroes. Patroclus, an awkward young prince, has been exiled to the court of King Peleus and his perfect son Achilles. By all rights their paths should never cross, but Achilles takes the shamed prince as his friend, and as they grow into young men skilled in the arts of war and medicine their bond blossoms into something deeper - despite the displeasure of Achilles' mother Thetis, a cruel sea goddess.",
        coverImage: "https://images.unsplash.com/photo-1512814406316-ed2fe359aa33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["Historical Fiction", "Fantasy", "Romance"],
        rating: "4.7",
        pages: 416,
        published: "March 6, 2012",
        isbn: "9780062060624",
        language: "English",
      },
      {
        title: "The Thursday Murder Club",
        author: "Richard Osman",
        description: "In a peaceful retirement village, four unlikely friends meet weekly in the Jigsaw Room to discuss unsolved crimes; together they call themselves the Thursday Murder Club. When a local developer is found dead with a mysterious photograph left next to the body, the Thursday Murder Club suddenly find themselves in the middle of their first live case.",
        coverImage: "https://images.unsplash.com/photo-1580775266295-0d23a092d2cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        genres: ["Mystery", "Humor", "Fiction"],
        rating: "4.1",
        pages: 382,
        published: "September 3, 2020",
        isbn: "9780241425459",
        language: "English",
      }
    ];
    
    // Add each sample book to storage
    sampleBooks.forEach(book => {
      const id = this.currentBookId++;
      this.books.set(id, { ...book, id });
    });
  }

  async getAllBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  async getBookById(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async searchBooks(query: string): Promise<Book[]> {
    const normalizedQuery = query.toLowerCase();
    return Array.from(this.books.values()).filter(book => 
      book.title.toLowerCase().includes(normalizedQuery) || 
      book.author.toLowerCase().includes(normalizedQuery)
    );
  }

  async filterBooksByGenres(genres: string[]): Promise<Book[]> {
    if (!genres.length) return this.getAllBooks();
    
    return Array.from(this.books.values()).filter(book => 
      genres.some(genre => book.genres.includes(genre))
    );
  }

  async getBooksByIds(ids: number[]): Promise<Book[]> {
    return ids
      .map(id => this.books.get(id))
      .filter((book): book is Book => book !== undefined);
  }

  async getFavoriteBooks(userId: string): Promise<Book[]> {
    const userFavoriteIds = this.userFavorites.get(userId);
    
    if (!userFavoriteIds || userFavoriteIds.size === 0) {
      return [];
    }
    
    return this.getBooksByIds(Array.from(userFavoriteIds));
  }

  async addFavoriteBook(favorite: InsertUserFavorite): Promise<UserFavorite> {
    // Create user favorites set if it doesn't exist
    if (!this.userFavorites.has(favorite.userId)) {
      this.userFavorites.set(favorite.userId, new Set());
    }
    
    // Add book to user favorites
    this.userFavorites.get(favorite.userId)!.add(favorite.bookId);
    
    // Create favorite record
    const id = this.currentFavoriteId++;
    const newFavorite: UserFavorite = { ...favorite, id };
    
    return newFavorite;
  }

  async removeFavoriteBook(userId: string, bookId: number): Promise<void> {
    const userFavoriteIds = this.userFavorites.get(userId);
    
    if (userFavoriteIds) {
      userFavoriteIds.delete(bookId);
    }
  }

  async isFavoriteBook(userId: string, bookId: number): Promise<boolean> {
    const userFavoriteIds = this.userFavorites.get(userId);
    return userFavoriteIds ? userFavoriteIds.has(bookId) : false;
  }

  async getUserPreferences(userId: string): Promise<UserPreference | undefined> {
    return this.userPreferences.get(userId);
  }

  async updateUserPreferences(preference: InsertUserPreference): Promise<UserPreference> {
    const id = this.userPreferences.has(preference.userId) 
      ? this.userPreferences.get(preference.userId)!.id 
      : this.currentPreferenceId++;
    
    const updatedPreference: UserPreference = { ...preference, id };
    this.userPreferences.set(preference.userId, updatedPreference);
    
    return updatedPreference;
  }

  async getRecommendedBooks(userId: string, limit = 6): Promise<Book[]> {
    const preferences = await this.getUserPreferences(userId);
    
    // If user has preferences, recommend based on those genres
    if (preferences && preferences.genres.length > 0) {
      const recommendedBooks = await this.filterBooksByGenres(preferences.genres);
      return recommendedBooks.slice(0, limit);
    }
    
    // Otherwise return popular books
    return this.getPopularBooks(limit);
  }

  async getPopularBooks(limit = 6): Promise<Book[]> {
    // In a real application, we would sort by popularity metrics
    // For this implementation, we'll use the highest rated books
    const allBooks = await this.getAllBooks();
    return allBooks
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, limit);
  }

  async getBooksByCategory(category: string): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => 
      book.genres.some(genre => genre.toLowerCase() === category.toLowerCase())
    );
  }

  async getBookReviews(bookId: number): Promise<BookReview[]> {
    return this.bookReviews.get(bookId) || [];
  }

  async addBookReview(review: InsertBookReview): Promise<BookReview> {
    if (!this.bookReviews.has(review.bookId)) {
      this.bookReviews.set(review.bookId, []);
    }
    
    const id = this.currentReviewId++;
    const now = new Date();
    const newReview: BookReview = { ...review, id, createdAt: now };
    
    this.bookReviews.get(review.bookId)!.push(newReview);
    return newReview;
  }

  async updateBookReview(id: number, review: Partial<InsertBookReview>): Promise<BookReview> {
    // Find the review in all book reviews
    for (const bookId of Array.from(this.bookReviews.keys())) {
      const reviews = this.bookReviews.get(bookId) || [];
      const reviewIndex = reviews.findIndex((r: BookReview) => r.id === id);
      
      if (reviewIndex !== -1) {
        const existingReview = reviews[reviewIndex];
        const updatedReview: BookReview = {
          ...existingReview,
          ...review,
          id, // Ensure id doesn't change
          createdAt: existingReview.createdAt // Keep original date
        };
        
        reviews[reviewIndex] = updatedReview;
        return updatedReview;
      }
    }
    
    throw new Error("Review not found");
  }

  async deleteBookReview(id: number): Promise<void> {
    for (const bookId of Array.from(this.bookReviews.keys())) {
      const reviews = this.bookReviews.get(bookId) || [];
      const reviewIndex = reviews.findIndex((r: BookReview) => r.id === id);
      
      if (reviewIndex !== -1) {
        reviews.splice(reviewIndex, 1);
        return;
      }
    }
  }

  async getUserReviews(userId: string): Promise<BookReview[]> {
    const userReviews: BookReview[] = [];
    
    for (const bookId of Array.from(this.bookReviews.keys())) {
      const reviews = this.bookReviews.get(bookId) || [];
      const filteredReviews = reviews.filter((review: BookReview) => review.userId === userId);
      userReviews.push(...filteredReviews);
    }
    
    return userReviews;
  }

  async getReadingProgress(userId: string, bookId: number): Promise<ReadingProgress | undefined> {
    if (!this.readingProgress.has(userId)) {
      return undefined;
    }
    
    const userProgress = this.readingProgress.get(userId);
    return userProgress?.get(bookId);
  }

  async updateReadingProgress(progress: InsertReadingProgress): Promise<ReadingProgress> {
    if (!this.readingProgress.has(progress.userId)) {
      this.readingProgress.set(progress.userId, new Map());
    }
    
    const userProgress = this.readingProgress.get(progress.userId)!;
    
    // Check if progress already exists
    const id = userProgress.has(progress.bookId)
      ? userProgress.get(progress.bookId)!.id
      : this.currentProgressId++;
    
    const now = new Date();
    // Ensure required fields have default values
    const updatedProgress: ReadingProgress = { 
      ...progress, 
      id, 
      lastUpdated: now,
      status: progress.status || "not_started",
      pagesRead: progress.pagesRead !== undefined ? progress.pagesRead : 0
    };
    
    userProgress.set(progress.bookId, updatedProgress);
    return updatedProgress;
  }

  async getUserReadingList(userId: string): Promise<{book: Book, progress: ReadingProgress}[]> {
    if (!this.readingProgress.has(userId)) {
      return [];
    }
    
    const userProgress = this.readingProgress.get(userId)!;
    const result: {book: Book, progress: ReadingProgress}[] = [];
    
    for (const bookId of Array.from(userProgress.keys())) {
      const progress = userProgress.get(bookId)!;
      const book = await this.getBookById(bookId);
      if (book) {
        result.push({ book, progress });
      }
    }
    
    return result;
  }
}

export const storage = new MemStorage();
