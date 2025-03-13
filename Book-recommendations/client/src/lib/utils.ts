import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const genres = [
  "Fiction",
  "Mystery",
  "Science Fiction",
  "Romance",
  "Biography",
  "Fantasy",
  "History",
  "Thriller",
  "Self-Help",
  "Nonfiction",
  "Adventure",
  "Literary",
  "Historical Fiction",
  "Psychology",
  "Science",
  "Memoir",
  "Humor",
  "Philosophy"
];

export const categories = [
  "Contemporary Fiction",
  "Historical Fiction",
  "Science Fiction",
  "Mystery & Thriller",
  "Fantasy",
  "Romance",
  "Biography & Memoir",
  "Self-Help",
  "Nonfiction",
  "Young Adult",
  "Literary Fiction"
];

export function getStarRating(rating: string) {
  const numRating = parseFloat(rating);
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return { fullStars, hasHalfStar, emptyStars };
}
