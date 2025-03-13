import { Book } from "@shared/schema";
import BookCard from "./BookCard";

interface BookGridProps {
  books: Book[];
  onViewBook: (book: Book) => void;
}

export default function BookGrid({ books, onViewBook }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map(book => (
        <BookCard 
          key={book.id} 
          book={book} 
          onClick={() => onViewBook(book)} 
        />
      ))}
    </div>
  );
}
