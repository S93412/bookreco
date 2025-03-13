import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ContentSection from "@/components/ContentSection";
import Footer from "@/components/Footer";
import BookDetailsModal from "@/components/BookDetailsModal";
import { Book } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  
  const handleSearch = () => {
    // Search is handled through the ContentSection component
    // This is just a placeholder for the navbar search button
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
      
      <main className="flex-grow">
        <HeroSection />
        
        <ContentSection 
          searchQuery={searchQuery}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          minRating={minRating}
          setMinRating={setMinRating}
          onViewBookDetails={handleViewBookDetails}
        />
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
