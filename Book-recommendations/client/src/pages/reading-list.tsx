import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookDetailsModal from "@/components/BookDetailsModal";
import BookCard from "@/components/BookCard";
import { useFavoriteBooks } from "@/hooks/useBooks";
import { Book } from "@shared/schema";

export default function ReadingList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: favoriteBooks, isLoading } = useFavoriteBooks();
  
  const handleSearch = () => {
    // For future search within favorites implementation
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
        <h2 className="font-merriweather text-3xl font-bold mb-8 text-primary">My Reading List</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
            <p className="text-gray-500">Loading your reading list...</p>
          </div>
        ) : favoriteBooks && favoriteBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteBooks.map((book) => (
              <BookCard 
                key={book.id}
                book={book}
                onClick={() => handleViewBookDetails(book)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="font-merriweather text-xl font-medium mb-2 text-primary">Your reading list is empty</h3>
            <p className="text-gray-600 mb-6">Add books to your reading list by clicking the heart icon on any book.</p>
            <a href="/" className="inline-block bg-secondary hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold transition">
              Discover Books
            </a>
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
