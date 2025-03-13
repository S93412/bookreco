import { useState } from "react";
import { categories } from "@/lib/utils";

interface FilterSidebarProps {
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  setMinRating: (rating: number | null) => void;
  setLengthFilter: (length: string | null) => void;
}

export default function FilterSidebar({ 
  activeFilters, 
  setActiveFilters, 
  setMinRating, 
  setLengthFilter 
}: FilterSidebarProps) {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedLength, setSelectedLength] = useState<string | null>(null);
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setActiveFilters(prev => [...prev, category]);
    } else {
      setActiveFilters(prev => prev.filter(c => c !== category));
    }
  };
  
  const handleRatingClick = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(0);
      setMinRating(null);
    } else {
      setSelectedRating(rating);
      setMinRating(rating);
    }
  };
  
  const handleLengthChange = (length: string | null) => {
    setSelectedLength(length);
    setLengthFilter(length);
  };
  
  const applyFilters = () => {
    // Filters are applied immediately when changed
    // This button is just for visual consistency with the design
  };
  
  return (
    <div className="lg:w-1/4">
      <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
        <h3 className="font-merriweather text-xl font-bold mb-6 text-primary">Refine Results</h3>
        
        {/* Categories Filter */}
        <div className="mb-6">
          <h4 className="font-merriweather font-semibold mb-3 text-primary">Categories</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded text-accent focus:ring-accent" 
                  checked={activeFilters.includes(category)}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Rating Filter */}
        <div className="mb-6">
          <h4 className="font-merriweather font-semibold mb-3 text-primary">Minimum Rating</h4>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map(rating => (
              <button 
                key={rating}
                className="text-xl"
                onClick={() => handleRatingClick(rating)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill={rating <= selectedRating ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={rating <= selectedRating ? "text-yellow-400" : "text-gray-300"}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
        
        {/* Length Filter */}
        <div className="mb-6">
          <h4 className="font-merriweather font-semibold mb-3 text-primary">Book Length</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="length" 
                className="text-accent focus:ring-accent"
                checked={selectedLength === 'short'}
                onChange={() => handleLengthChange('short')}
              />
              <span className="text-sm">Short (&lt; 300 pages)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="length" 
                className="text-accent focus:ring-accent"
                checked={selectedLength === 'medium'}
                onChange={() => handleLengthChange('medium')}
              />
              <span className="text-sm">Medium (300-500 pages)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="length" 
                className="text-accent focus:ring-accent"
                checked={selectedLength === 'long'}
                onChange={() => handleLengthChange('long')}
              />
              <span className="text-sm">Long (&gt; 500 pages)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="length" 
                className="text-accent focus:ring-accent"
                checked={selectedLength === null}
                onChange={() => handleLengthChange(null)}
              />
              <span className="text-sm">Any length</span>
            </label>
          </div>
        </div>
        
        <button 
          className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
