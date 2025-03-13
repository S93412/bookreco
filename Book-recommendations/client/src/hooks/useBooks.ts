import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Book, UserPreference } from "@shared/schema";

// New types for the Google Books API response structure
interface PaginatedBooksResponse {
  books: Book[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

export const useAllBooks = () => {
  return useQuery<Book[]>({
    queryKey: ["/api/books"],
  });
};

export const useBookDetails = (id: number | null) => {
  return useQuery<Book>({
    queryKey: [`/api/books/${id}`],
    enabled: id !== null,
  });
};

export const useSearchBooks = (query: string, page = 0) => {
  return useQuery<PaginatedBooksResponse>({
    queryKey: [`/api/books/search`, query, page],
    queryFn: async () => {
      const response = await apiRequest<PaginatedBooksResponse>(
        "GET", 
        `/api/books/search?q=${encodeURIComponent(query)}&page=${page}`
      );
      
      // Handle both old and new response formats
      if (Array.isArray(response)) {
        // Old format - just an array of books
        return {
          books: response,
          totalItems: response.length,
          currentPage: 0,
          itemsPerPage: response.length
        };
      }
      
      // New format with pagination
      return response;
    },
    enabled: query.length > 0,
  });
};

export const useFilterBooks = (genres: string[]) => {
  const queryString = genres.map(g => `genres=${encodeURIComponent(g)}`).join('&');
  return useQuery<Book[]>({
    queryKey: [`/api/books/filter?${queryString}`],
    enabled: genres.length > 0,
  });
};

export const useFavoriteBooks = () => {
  return useQuery<Book[]>({
    queryKey: ["/api/favorites"],
  });
};

export const useAddToFavorites = () => {
  return useMutation({
    mutationFn: async (bookId: number) => {
      await apiRequest("POST", "/api/favorites", { bookId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });
};

export const useRemoveFromFavorites = () => {
  return useMutation({
    mutationFn: async (bookId: number) => {
      await apiRequest("DELETE", `/api/favorites/${bookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });
};

export const useIsFavorite = (bookId: number | null) => {
  return useQuery<{ isFavorite: boolean }>({
    queryKey: [`/api/favorites/${bookId}`],
    enabled: bookId !== null,
  });
};

export const useUserPreferences = () => {
  return useQuery<UserPreference>({
    queryKey: ["/api/preferences"],
  });
};

export const useUpdatePreferences = () => {
  return useMutation({
    mutationFn: async (genres: string[]) => {
      await apiRequest("POST", "/api/preferences", { genres });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
  });
};

export const useRecommendedBooks = () => {
  return useQuery<Book[]>({
    queryKey: ["/api/recommendations"],
  });
};

export const usePopularBooks = () => {
  return useQuery<Book[]>({
    queryKey: ["/api/popular"],
  });
};

// New hook for categories with pagination support
export const useBooksByCategory = (category: string | null, page = 0) => {
  return useQuery<PaginatedBooksResponse>({
    queryKey: ['/api/categories', category, page],
    queryFn: async () => {
      if (!category) {
        return { books: [], totalItems: 0, currentPage: 0, itemsPerPage: 40 };
      }
      
      const response = await apiRequest<PaginatedBooksResponse | Book[]>(
        "GET", 
        `/api/categories/${encodeURIComponent(category)}?page=${page}`
      );
      
      // Handle both old and new response formats
      if (Array.isArray(response)) {
        // Old format - just an array of books
        return {
          books: response,
          totalItems: response.length,
          currentPage: 0,
          itemsPerPage: response.length
        };
      }
      
      // New format with pagination
      return response;
    },
    enabled: category !== null && category !== '',
  });
};
