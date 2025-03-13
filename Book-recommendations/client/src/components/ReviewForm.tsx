import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Book } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  book: Book;
  onSuccess?: () => void;
}

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review must be less than 1000 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ReviewForm({ book, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  
  const { 
    register, 
    handleSubmit,
    reset,
    formState: { errors } 
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    }
  });
  
  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", `/api/books/${book.id}/reviews`, {
        rating: data.rating,
        comment: data.comment
      });
      
      toast({
        title: "Review submitted",
        description: "Your review has been added successfully",
      });
      
      reset();
      setRating(0);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-merriweather text-xl font-semibold mb-4 text-primary">Write a Review</h3>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className="text-2xl focus:outline-none"
                {...register("rating", { value: rating })}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill={rating >= star ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={rating >= star ? "text-yellow-400" : "text-gray-300"}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            ))}
            <input 
              type="hidden" 
              value={rating} 
              {...register("rating", { value: rating })} 
            />
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Review</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            rows={4}
            placeholder="Share your thoughts about this book..."
            {...register("comment")}
          ></textarea>
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </div>
          ) : "Submit Review"}
        </button>
      </form>
    </div>
  );
}