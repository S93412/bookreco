import { Book } from "@shared/schema";
import fetch from "node-fetch";

// Maximum results per page for Google Books API
const MAX_RESULTS = 40;

// Interface for Google Books API response
interface GoogleBooksResponse {
  items: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail?: string;
      };
      categories?: string[];
      averageRating?: number;
      pageCount?: number;
      publishedDate?: string;
      industryIdentifiers?: Array<{
        type: string;
        identifier: string;
      }>;
      language?: string;
    };
  }>;
  totalItems: number;
}

// Map Google Books API response to our Book schema
function mapGoogleBookToBook(book: GoogleBooksResponse["items"][0], index: number): Book {
  const volumeInfo = book.volumeInfo;
  
  // Generate a predictable ID based on the Google Books ID
  // This helps with caching and consistency
  const id = parseInt(book.id.replace(/\D/g, "").substring(0, 9), 10) || index + 1000000;
  
  // Extract ISBN when available
  const isbn = volumeInfo.industryIdentifiers?.find(id => 
    id.type === "ISBN_13" || id.type === "ISBN_10"
  )?.identifier || "";
  
  return {
    id,
    title: volumeInfo.title || "Unknown Title",
    author: volumeInfo.authors?.[0] || "Unknown Author",
    description: volumeInfo.description || "No description available",
    coverImage: volumeInfo.imageLinks?.thumbnail || "/placeholder-cover.jpg",
    genres: volumeInfo.categories || ["Uncategorized"],
    rating: (volumeInfo.averageRating || 0).toString(),
    pages: volumeInfo.pageCount || 0,
    published: volumeInfo.publishedDate || "Unknown",
    isbn,
    language: volumeInfo.language || "en"
  };
}

// Cache to reduce API calls
const cache: Record<string, { timestamp: number, data: Book[] }> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function searchGoogleBooks(query: string, startIndex = 0): Promise<{ books: Book[], totalItems: number }> {
  const cacheKey = `${query}_${startIndex}`;
  
  // Check cache first
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return { 
      books: cache[cacheKey].data,
      totalItems: cache[cacheKey].data.length > 0 ? 1000000 : 0 // Approximation for large datasets
    };
  }
  
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Books API responded with ${response.status}`);
    }
    
    const data = await response.json() as GoogleBooksResponse;
    
    const books = data.items ? data.items.map(mapGoogleBookToBook) : [];
    
    // Cache the results
    cache[cacheKey] = {
      timestamp: Date.now(),
      data: books
    };
    
    return {
      books,
      totalItems: data.totalItems || books.length
    };
  } catch (error) {
    console.error("Error fetching from Google Books API:", error);
    return { books: [], totalItems: 0 };
  }
}

export async function getBooksByCategory(category: string, startIndex = 0): Promise<{ books: Book[], totalItems: number }> {
  // Search for books in the specific category/genre
  return searchGoogleBooks(`subject:${category}`, startIndex);
}

export async function getBookDetails(googleBookId: string): Promise<Book | null> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes/${googleBookId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Books API responded with ${response.status}`);
    }
    
    // Parse the response and check if it has the expected structure
    const data = await response.json();
    
    // Validate that the data has the required structure before mapping
    if (typeof data === 'object' && data !== null && 'id' in data && 'volumeInfo' in data) {
      return mapGoogleBookToBook(data as GoogleBooksResponse["items"][0], 0);
    } else {
      throw new Error('Invalid book data structure received from Google Books API');
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

// Get trending or popular books (fiction best sellers as a default)
export async function getPopularBooks(limit = 40): Promise<Book[]> {
  const { books } = await searchGoogleBooks("subject:fiction&orderBy=relevance", 0);
  return books.slice(0, limit);
}