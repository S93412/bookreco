import { useState } from "react";
import { useUpdatePreferences } from "@/hooks/useBooks";
import { genres } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const updatePreferences = useUpdatePreferences();
  
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };
  
  const getRecommendations = () => {
    updatePreferences.mutate(selectedGenres);
  };
  
  return (
    <section className="relative overflow-hidden py-20 lg:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRkZGIiBvcGFjaXR5PSIuMDMiIGQ9Ik0wIDBoMTQ0MHY3NjBIMHoiLz48cGF0aCBkPSJNLTU0MS43OTMgNDEzLjg0N0MtMzAyLjQ3MSA0NjguMTQ3IDI2LjkzIDQ0NS4xMzQgNTA0Ljc5MyAzNTUuMzVjMzU1LjczMS02Ny4wNiA2OTMuOTI5IDgzLjc0OSA4OTMuMDQxLTEyOS41OTVsLTEuNDI2IDE0MC4xYy0xOTEuNjQzIDIyOS4xNzQtNTI2LjE0NiA1OC44NjYtODY1LjQ5OCAxMjEuNDg0LTQ1My45OTIgODQuMDk3LTc2MC4xMzggODAuODA4LTEwNzAuODg0LTQuMDk3bC0uMDI5LTY4LjI0NXoiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PHBhdGggZD0iTTAgMTh2Mzk4YzI0Ny43MDQgNTQuNDQ5IDU3My4yMDggMTMuNzcgOTc3LjMxOC03Mi4xMzYgMjY4LjUxMi01Ny4wOTcgNTc5LjIwNCAyOC44NSA3ODEuOTgtMzIuNzk1VjE3LjA3OEwwIDE4eiIgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIuMDQiLz48L2c+PC9zdmc+')] bg-no-repeat bg-bottom bg-cover opacity-50"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-white max-w-2xl">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-6 border border-white/20">
              <span className="text-white/90">📚 Over 129 million books in our database</span>
            </div>
            
            <h2 className="font-merriweather text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Your Journey to <span className="text-white/90 relative">
                Remarkable
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 318 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M317.956 5.69835C312.495 5.71886 307.07 5.09579 301.698 5.04892C291.657 4.96159 281.616 4.95003 271.573 4.91063C264.862 4.88509 258.148 4.95003 251.437 4.91063C233.173 4.80721 214.91 4.7295 196.647 4.62789C186.669 4.5722 176.734 4.10403 166.757 4.04755C149.946 3.94412 133.135 3.84069 116.323 3.7414C107.234 3.68773 98.1458 3.63123 89.0566 3.57756C81.1463 3.53235 73.2361 3.47868 65.3269 3.44121C60.5045 3.41762 55.6831 3.39116 50.8617 3.36758C39.6355 3.31391 28.4103 3.25445 17.1841 3.20078C15.7462 3.19307 14.3084 3.18729 12.8725 3.17958C11.7773 3.1728 10.6812 3.16898 9.58697 3.16415C9.28405 3.16319 8.9792 3.14923 8.67532 3.16415C5.85508 3.28176 2.99821 2.6274 0.184466 2.90479C-0.0619171 2.93033 0.0137609 3.35793 0.260344 3.33336C2.91435 3.06365 5.60893 3.58544 8.26761 3.50005C9.28981 3.46831 10.3101 3.47676 11.3323 3.48159C12.5234 3.48734 13.7155 3.49809 14.9066 3.50483C17.2878 3.51832 19.669 3.53427 22.0512 3.54776C28.1976 3.58544 34.344 3.62313 40.4905 3.66081C54.7819 3.73849 69.0724 3.81617 83.3619 3.89385C92.4521 3.9416 101.543 3.98935 110.634 4.03711C134.822 4.16335 158.963 4.91063 183.149 5.04892C192.241 5.10068 201.332 5.15242 210.423 5.20418C219.513 5.25593 228.603 5.3096 237.693 5.36135C251.984 5.43903 266.274 5.51863 280.566 5.59631C290.545 5.65388 300.568 5.39961 310.547 5.45718C312.97 5.46877 315.438 5.72687 317.862 5.49837C318.108 5.47284 318.202 5.69258 317.956 5.69835Z" fill="white" fillOpacity="0.5"/>
                </svg>
              </span> Reading
            </h2>
            
            <p className="text-lg mb-8 text-white/80 font-opensans">
              Select your favorite genres and discover personalized book recommendations that match your unique reading preferences.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {genres.slice(0, 10).map(genre => (
                <button 
                  key={genre}
                  className={cn(
                    "px-4 py-2 rounded-full transition text-sm font-opensans font-medium",
                    selectedGenres.includes(genre)
                      ? "bg-white text-primary shadow-lg scale-105 transform"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  )}
                  onClick={() => toggleGenre(genre)}
                >
                  {selectedGenres.includes(genre) && (
                    <span className="mr-1.5">✓</span>
                  )}
                  {genre}
                </button>
              ))}
            </div>
            
            <button 
              className="bg-white hover:bg-white/90 text-primary px-8 py-3.5 rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center"
              onClick={getRecommendations}
              disabled={updatePreferences.isPending}
            >
              {updatePreferences.isPending ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Curating Your Book List...
                </div>
              ) : (
                <>
                  Find My Perfect Books
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
          
          {/* Right Side - Book Stack */}
          <div className="hidden lg:block relative">
            <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[120%] rounded-full bg-white/5 blur-3xl"></div>
            <div className="relative">
              <div className="absolute -left-8 top-12 transform -rotate-6 shadow-2xl rounded-lg w-48 h-64 z-10">
                <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=387&auto=format&fit=crop" 
                  alt="Book cover" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="absolute left-20 top-6 transform rotate-3 shadow-2xl rounded-lg w-48 h-64 z-20">
                <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1298&auto=format&fit=crop" 
                  alt="Book cover" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="relative left-6 shadow-2xl rounded-lg w-48 h-64 z-30">
                <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1374&auto=format&fit=crop" 
                  alt="Book cover" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
