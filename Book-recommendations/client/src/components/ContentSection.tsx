import { useState, useEffect } from "react";
import { useRecommendedBooks, usePopularBooks, useSearchBooks, useFilterBooks } from "@/hooks/useBooks";
import FilterSidebar from "./FilterSidebar";
import BookGrid from "./BookGrid";
import { Book } from "@shared/schema";

interface ContentSectionProps {
  searchQuery: string;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  minRating: number | null;
  setMinRating: (rating: number | null) => void;
  onViewBookDetails: (book: Book) => void;
}

export default function ContentSection({
  searchQuery,
  activeFilters,
  setActiveFilters,
  minRating,
  setMinRating,
  onViewBookDetails
}: ContentSectionProps) {
  const [bookLengthFilter, setBookLengthFilter] = useState<string | null>(null);
  const [displayBooks, setDisplayBooks] = useState<Book[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Fetch recommendations and popular books
  const { data: recommendedBooks, isLoading: isLoadingRecommended } = useRecommendedBooks();
  const { data: popularBooks, isLoading: isLoadingPopular } = usePopularBooks();
  
  // Fetch search results if search query is present
  const { data: searchResults, isLoading: isSearching } = useSearchBooks(searchQuery);
  
  // Fetch filtered books based on active filters
  const { data: filteredBooks, isLoading: isFiltering } = useFilterBooks(activeFilters);
  
  // Handle search results
  useEffect(() => {
    if (searchQuery && searchResults) {
      // Check if the search results contain books array (paginated response)
      if (searchResults.books) {
        setDisplayBooks(searchResults.books);
      } else if (Array.isArray(searchResults)) {
        // Handle case where search results is directly an array
        setDisplayBooks(searchResults);
      }
      setIsSearchActive(true);
    } else if (searchQuery === '') {
      setIsSearchActive(false);
    }
  }, [searchQuery, searchResults]);
  
  // Handle filter results
  useEffect(() => {
    if (activeFilters.length > 0 && filteredBooks) {
      setDisplayBooks(filteredBooks);
      setIsSearchActive(true);
    } else if (activeFilters.length === 0 && isSearchActive && !searchQuery) {
      setIsSearchActive(false);
    }
  }, [activeFilters, filteredBooks, searchQuery, isSearchActive]);
  
  // Apply minimum rating filter
  useEffect(() => {
    if (minRating !== null) {
      setDisplayBooks(prev => 
        prev.filter(book => parseFloat(book.rating) >= minRating)
      );
      setIsSearchActive(true);
    }
  }, [minRating]);
  
  // Apply book length filter
  useEffect(() => {
    if (bookLengthFilter) {
      setDisplayBooks(prev => {
        switch (bookLengthFilter) {
          case 'short':
            return prev.filter(book => book.pages < 300);
          case 'medium':
            return prev.filter(book => book.pages >= 300 && book.pages <= 500);
          case 'long':
            return prev.filter(book => book.pages > 500);
          default:
            return prev;
        }
      });
      setIsSearchActive(true);
    }
  }, [bookLengthFilter]);
  
  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
    
    if (filter.startsWith('Rating:')) {
      setMinRating(null);
    }
    
    if (filter.startsWith('Length:')) {
      setBookLengthFilter(null);
    }
  };
  
  const applyLengthFilter = (length: string | null) => {
    setBookLengthFilter(length);
    
    // Update active filters for display
    setActiveFilters(prev => {
      const newFilters = prev.filter(f => !f.startsWith('Length:'));
      if (length) {
        let filterName = '';
        switch (length) {
          case 'short': filterName = 'Length: Short (<300 pages)'; break;
          case 'medium': filterName = 'Length: Medium (300-500 pages)'; break;
          case 'long': filterName = 'Length: Long (>500 pages)'; break;
        }
        return [...newFilters, filterName];
      }
      return newFilters;
    });
  };
  
  // For displaying active filters
  const allActiveFilters = [
    ...activeFilters,
    ...(minRating ? [`Rating: ${minRating}+`] : [])
  ];
  
  // Determine what to show: search results, filtered results, or default sections
  const isLoading = isSearching || isFiltering || isLoadingRecommended || isLoadingPopular;
  
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar 
          activeFilters={activeFilters} 
          setActiveFilters={setActiveFilters} 
          setMinRating={setMinRating}
          setLengthFilter={applyLengthFilter}
        />
        
        <div className="lg:w-3/4">
          {/* Active Filters */}
          {allActiveFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {allActiveFilters.map(filter => (
                <span key={filter} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                  {filter}
                  <button className="ml-2 text-xs" onClick={() => removeFilter(filter)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </span>
              ))}
              {allActiveFilters.length > 1 && (
                <button 
                  className="text-sm text-primary hover:text-secondary"
                  onClick={() => {
                    setActiveFilters([]);
                    setMinRating(null);
                    setBookLengthFilter(null);
                  }}
                >
                  Clear all
                </button>
              )}
            </div>
          )}
          
          {isSearchActive ? (
            // Search or Filter Results
            <div>
              <h2 className="font-merriweather text-2xl font-bold mb-6 text-primary">
                {searchQuery ? `Results for "${searchQuery}"` : "Filtered Books"}
              </h2>
              
              {isLoading ? (
                <div className="w-full flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
                  <p className="text-gray-500">Finding books for you...</p>
                </div>
              ) : displayBooks.length > 0 ? (
                <BookGrid 
                  books={displayBooks} 
                  onViewBook={onViewBookDetails} 
                />
              ) : (
                <div className="bg-white rounded-lg p-8 text-center shadow-md">
                  <h3 className="font-merriweather text-xl mb-2">No Books Found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          ) : (
            // Default view with Recommendations and Popular Books
            <>
              {/* Recommended Books Section */}
              <div className="mb-12">
                <h2 className="font-merriweather text-2xl font-bold mb-6 text-primary">Recommended For You</h2>
                
                {isLoadingRecommended ? (
                  <div className="w-full flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
                    <p className="text-gray-500">Finding your perfect books...</p>
                  </div>
                ) : recommendedBooks && recommendedBooks.length > 0 ? (
                  <BookGrid 
                    books={recommendedBooks} 
                    onViewBook={onViewBookDetails} 
                  />
                ) : (
                  <div className="bg-white rounded-lg p-8 text-center shadow-md">
                    <h3 className="font-merriweather text-xl mb-2">No Recommendations Yet</h3>
                    <p className="text-gray-600">Select your favorite genres to get personalized recommendations.</p>
                  </div>
                )}
              </div>
              
              {/* Popular Books Section */}
              <div>
                <h2 className="font-merriweather text-2xl font-bold mb-6 text-primary">Popular This Week</h2>
                
                {isLoadingPopular ? (
                  <div className="w-full flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
                    <p className="text-gray-500">Loading popular books...</p>
                  </div>
                ) : popularBooks && popularBooks.length > 0 ? (
                  <BookGrid 
                    books={popularBooks} 
                    onViewBook={onViewBookDetails} 
                  />
                ) : (
                  <div className="bg-white rounded-lg p-8 text-center shadow-md">
                    <h3 className="font-merriweather text-xl mb-2">No Books Available</h3>
                    <p className="text-gray-600">Check back soon for popular books.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
