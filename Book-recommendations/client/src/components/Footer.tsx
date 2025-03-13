export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Newsletter section */}
      <div className="bg-primary/5">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-merriweather text-2xl font-bold text-primary mb-3">Stay Updated</h3>
              <p className="text-gray-600 mb-0 max-w-md">
                Subscribe to our newsletter to receive personalized book recommendations and updates on new releases.
              </p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-white mr-3 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <h2 className="font-merriweather text-xl font-bold text-gray-900">BookBuddy</h2>
            </div>
            <p className="text-gray-600 mb-6 max-w-sm font-opensans">
              Discover your next favorite book with BookBuddy, your personal guide to finding reads that match your unique interests and preferences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14z"></path>
                  <path d="M9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-merriweather font-semibold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-3 font-opensans">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary transition-colors">Home</a>
              </li>
              <li>
                <a href="/categories" className="text-gray-600 hover:text-primary transition-colors">Browse Categories</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">New Releases</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Popular Picks</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Book Clubs</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-merriweather font-semibold text-gray-900 mb-4">Account</h3>
            <ul className="space-y-3 font-opensans">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Your Profile</a>
              </li>
              <li>
                <a href="/reading-list" className="text-gray-600 hover:text-primary transition-colors">Reading List</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Preferences</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Reading History</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Your Reviews</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-merriweather font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 font-opensans">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">About Us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} BookBuddy. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Cookies</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
