import { useMemo } from "react";
import { Book } from "@shared/schema";
import { useIsFavorite, useAddToFavorites, useRemoveFromFavorites } from "@/hooks/useBooks";
import { getStarRating } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  const { data: favoriteStatus, isLoading: isCheckingFavorite } = useIsFavorite(book.id);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  
  const isFavorite = favoriteStatus?.isFavorite || false;
  
  const { fullStars, hasHalfStar, emptyStars } = useMemo(() => 
    getStarRating(book.rating), [book.rating]
  );
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFavorite) {
      removeFromFavorites.mutate(book.id);
    } else {
      addToFavorites.mutate(book.id);
    }
  };
  
  return (
    <div className="book-card card-hover-effect" onClick={onClick}>
      <div className="book-cover">
        <img 
          src={book.coverImage || "https://placehold.co/200x300/f5f5f5/4F46E5?text=No+Cover"} 
          alt={`Book cover for ${book.title}`} 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/200x300/f5f5f5/4F46E5?text=No+Cover";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        
        {/* Category Badge */}
        {book.genres && book.genres.length > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-primary/90 text-white backdrop-blur-sm">
            {book.genres[0]}
          </span>
        )}
        
        {/* Favorite Button */}
        <button 
          className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center shadow-sm transition
            ${isFavorite 
              ? 'bg-primary text-white' 
              : 'bg-white/90 text-gray-500 hover:bg-white'}`}
          onClick={toggleFavorite}
          disabled={isCheckingFavorite || addToFavorites.isPending || removeFromFavorites.isPending}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isCheckingFavorite || addToFavorites.isPending || removeFromFavorites.isPending ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            isFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            )
          )}
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-merriweather font-bold text-lg mb-1 text-primary line-clamp-1">{book.title}</h3>
        <p className="text-gray-700 text-sm mb-2 line-clamp-1 font-opensans">{book.author}</p>
        
        {/* Rating Stars */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="rating-stars">
            {[...Array(fullStars)].map((_, i) => (
              <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            {hasHalfStar && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0" fill="currentColor">
                <defs>
                  <linearGradient id="half-fill" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="50%" style={{ stopColor: "currentColor", stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: "currentColor", stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half-fill)" />
              </svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
              <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">{book.rating}</span>
        </div>
        
        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1">
          {book.genres && book.genres.slice(0, 2).map(genre => (
            <span key={genre} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-opensans font-medium">{genre}</span>
          ))}
        </div>
        
        {/* View Details Link */}
        <div className="mt-3 flex items-center text-primary font-opensans font-medium text-sm hover:text-primary/80 transition-colors cursor-pointer">
          View details
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
