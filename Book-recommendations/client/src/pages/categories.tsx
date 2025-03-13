import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookGrid from "@/components/BookGrid";
import BookDetailsModal from "@/components/BookDetailsModal";
import { Book } from "@shared/schema";
import { categories } from "@/lib/utils";
import { useBooksByCategory } from "@/hooks/useBooks";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [_, setLocation] = useLocation();
  
  // Check for category in URL params
  const [match, params] = useRoute("/categories/:category?");
  
  // Fetch books using the new hook with pagination
  const { 
    data: booksData, 
    isLoading, 
    isError 
  } = useBooksByCategory(selectedCategory, currentPage);
  
  // Extract books and pagination info
  const books = booksData?.books || [];
  const totalBooks = booksData?.totalItems || 0;
  const totalPages = Math.ceil(totalBooks / (booksData?.itemsPerPage || 40));
  
  useEffect(() => {
    if (match && params && params.category) {
      setSelectedCategory(decodeURIComponent(params.category));
      // Reset to page 0 when category changes
      setCurrentPage(0);
    }
  }, [match, params]);
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setLocation(`/categories/${encodeURIComponent(category)}`);
  };
  
  const handleViewBookDetails = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch} 
      />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <h2 className="font-merriweather text-3xl font-bold mb-8 text-primary">
          {selectedCategory ? `${selectedCategory} Books` : "Browse by Category"}
        </h2>
        
        {!selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <div 
                key={category}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                  <h3 className="font-merriweather text-xl font-bold mb-2 text-primary">{category}</h3>
                  <p className="text-gray-600 text-sm">Discover amazing books in this category</p>
                </div>
              </div>
            ))}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
            <p className="text-gray-500">Loading books...</p>
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setLocation("/categories")} 
                className="flex items-center text-primary hover:text-secondary transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to Categories
              </button>
              <span className="text-gray-600">
                {totalBooks > books.length 
                  ? `Showing ${books.length} of ${totalBooks.toLocaleString()} books` 
                  : `${books.length} books found`}
              </span>
            </div>
            
            <BookGrid books={books} onViewBook={handleViewBookDetails} />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-md border ${
                      currentPage === 0 
                        ? 'border-gray-200 bg-white text-gray-300 cursor-not-allowed' 
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="sr-only">Previous Page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <span className="px-3 py-2 rounded-md bg-primary text-white font-medium">
                    {currentPage + 1} / {Math.min(50, totalPages)}
                  </span>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(Math.min(49, totalPages - 1), p + 1))}
                    disabled={currentPage >= Math.min(49, totalPages - 1)}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-md border ${
                      currentPage >= Math.min(49, totalPages - 1)
                        ? 'border-gray-200 bg-white text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="sr-only">Next Page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <h3 className="font-merriweather text-xl mb-2">No Books Found</h3>
            <p className="text-gray-600 mb-4">We couldn't find any books in this category.</p>
            <button 
              onClick={() => setLocation("/categories")} 
              className="inline-block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
            >
              Browse Other Categories
            </button>
          </div>
        )}
      </main>
      
      <Footer />
      
      <BookDetailsModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
}