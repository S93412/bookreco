import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

export default function Navbar({ searchQuery, setSearchQuery, handleSearch }: NavbarProps) {
  const [location] = useLocation();
  
  return (
    <nav className="bg-white backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-white mr-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <h1 className="font-merriweather text-2xl font-bold text-primary">BookBuddy</h1>
              </div>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-12">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for books, authors, or genres..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full pl-10 pr-12 py-2.5 focus:ring-primary focus:border-primary focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-12 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchQuery('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
              <button 
                className="absolute inset-y-0 right-0 flex items-center px-4 text-sm bg-primary text-white rounded-r-full hover:bg-primary/90 transition-colors"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/">
              <div className={cn(
                "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location === "/" 
                  ? "text-primary bg-primary/5" 
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Home
              </div>
            </Link>
            
            <Link href="/categories">
              <div className={cn(
                "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.startsWith("/categories") 
                  ? "text-primary bg-primary/5" 
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect width="7" height="7" x="3" y="3" rx="1"/>
                  <rect width="7" height="7" x="14" y="3" rx="1"/>
                  <rect width="7" height="7" x="14" y="14" rx="1"/>
                  <rect width="7" height="7" x="3" y="14" rx="1"/>
                </svg>
                Categories
              </div>
            </Link>
            
            <Link href="/reading-list">
              <div className={cn(
                "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location === "/reading-list" 
                  ? "text-primary bg-primary/5" 
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528"/>
                </svg>
                My List
              </div>
            </Link>
            
            <button className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button">
              <svg className="w-6 h-6 text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile search bar */}
        <div className="flex md:hidden mt-4 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2 focus:ring-primary focus:border-primary focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <button 
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            onClick={handleSearch}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
