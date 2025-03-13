import { useState, useEffect } from "react";
import { Book } from "@shared/schema";
import { useIsFavorite, useAddToFavorites, useRemoveFromFavorites } from "@/hooks/useBooks";
import { getStarRating } from "@/lib/utils";

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDetailsModal({ book, isOpen, onClose }: BookDetailsModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  const { data: favoriteStatus, isLoading: isCheckingFavorite } = useIsFavorite(book?.id || null);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  
  const isFavorite = favoriteStatus?.isFavorite || false;
  
  useEffect(() => {
    setIsMounted(isOpen);
    
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  const toggleFavorite = () => {
    if (!book) return;
    
    if (isFavorite) {
      removeFromFavorites.mutate(book.id);
    } else {
      addToFavorites.mutate(book.id);
    }
  };
  
  if (!book) return null;
  
  const { fullStars, hasHalfStar, emptyStars } = getStarRating(book.rating);
  
  return (
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity p-4 ${isMounted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl transition-transform transform motion-safe:animate-slideIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 shadow-lg text-gray-700 hover:text-primary transition-colors z-10"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        
        {/* Book image (left side on desktop) */}
        <div className="w-full lg:w-2/5 xl:w-1/3 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-indigo-800/80 opacity-90"></div>
          
          <div className="relative h-64 lg:h-full">
            {/* Book Cover with 3D effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-72 lg:w-56 lg:h-80">
              <div className="relative w-full h-full">
                {/* Book spine shadow */}
                <div className="absolute inset-y-0 left-0 w-4 bg-black/40 rounded-l-sm transform origin-left skew-y-12"></div>
                
                {/* Book cover */}
                <img 
                  src={book.coverImage || "https://placehold.co/400x600/f5f5f5/4F46E5?text=No+Cover"}
                  alt={`Book cover for ${book.title}`} 
                  className="absolute inset-0 w-full h-full object-cover rounded-sm shadow-2xl z-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/400x600/f5f5f5/4F46E5?text=No+Cover";
                  }}
                />
                
                {/* Book overlay gradient */}
                <div className="absolute inset-0 rounded-sm bg-gradient-to-t from-black/30 to-transparent z-20"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 backdrop-blur-sm"></div>
          </div>
        </div>
        
        {/* Book details (right side on desktop) */}
        <div className="w-full lg:w-3/5 xl:w-2/3 p-6 lg:p-10 overflow-y-auto bg-white">
          {/* Title and Author */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="font-merriweather text-2xl lg:text-3xl font-bold text-gray-900">{book.title}</h2>
                <p className="text-gray-600 font-opensans text-lg">by {book.author}</p>
              </div>
              
              {/* Favorite Button */}
              <button 
                className={`h-12 w-12 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  isFavorite ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                onClick={toggleFavorite}
                disabled={isCheckingFavorite || addToFavorites.isPending || removeFromFavorites.isPending}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isCheckingFavorite || addToFavorites.isPending || removeFromFavorites.isPending ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  isFavorite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21l8.26-8.26a4.5 4.5 0 10-6.364-6.364L12 8.272l-1.896-1.896a4.5 4.5 0 00-6.364 6.364L12 21z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21l8.26-8.26a4.5 4.5 0 10-6.364-6.364L12 8.272l-1.896-1.896a4.5 4.5 0 00-6.364 6.364L12 21z"/>
                    </svg>
                  )
                )}
              </button>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-5">
              <div className="rating-stars">
                {[...Array(fullStars)].map((_, i) => (
                  <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
                {hasHalfStar && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0" fill="currentColor">
                    <defs>
                      <linearGradient id="half-fill-modal" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="50%" style={{ stopColor: "currentColor", stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: "currentColor", stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half-fill-modal)" />
                  </svg>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                  <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 font-medium">{book.rating}</span>
              <span className="text-gray-400">•</span>
              <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Reviews
              </button>
            </div>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {book.genres.map(genre => (
                <span key={genre} className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary font-medium">{genre}</span>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <h3 className="font-merriweather font-semibold text-lg text-gray-900">About the Book</h3>
              <div className="flex-grow ml-3 h-px bg-gray-200"></div>
            </div>
            <p className="text-gray-700 leading-relaxed font-opensans whitespace-pre-line">
              {book.description || "No description available for this book."}
            </p>
          </div>
          
          {/* Book Details */}
          <div className="bg-gray-50 rounded-xl p-5 mb-8">
            <h3 className="font-merriweather font-semibold text-base mb-4 text-gray-900">Book Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
              <div>
                <h4 className="text-gray-500 mb-1 font-opensans">Published</h4>
                <p className="font-medium text-gray-900">{book.published || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-gray-500 mb-1 font-opensans">Pages</h4>
                <p className="font-medium text-gray-900">{book.pages || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-gray-500 mb-1 font-opensans">ISBN</h4>
                <p className="font-medium text-gray-900">{book.isbn || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-gray-500 mb-1 font-opensans">Language</h4>
                <p className="font-medium text-gray-900">{book.language || "Unknown"}</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center ${
                isFavorite 
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200" 
                  : "bg-primary text-white shadow-md hover:shadow-lg hover:bg-primary/90"
              }`}
              onClick={!isFavorite ? toggleFavorite : undefined}
              disabled={isCheckingFavorite || addToFavorites.isPending}
            >
              {isCheckingFavorite || addToFavorites.isPending ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  {isFavorite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M12 21l8.26-8.26a4.5 4.5 0 10-6.364-6.364L12 8.272l-1.896-1.896a4.5 4.5 0 00-6.364 6.364L12 21z"/>
                    </svg>
                  )}
                  {isFavorite ? "Added to Reading List" : "Add to Reading List"}
                </>
              )}
            </button>
            
            <button className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Similar Books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
