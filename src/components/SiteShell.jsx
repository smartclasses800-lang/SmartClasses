import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ShoppingCart, 
  DollarSign, 
  User,
  BookOpen
} from 'lucide-react';

export default function SiteShell({ children }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#333333]">
      
      {/* 1. Top Announcement Bar */}
      <div className="announcement-bg text-center py-2 px-4 text-xs sm:text-sm font-medium border-b border-[#f3dec3]">
        <span className="live-gradient live-gradient-strong">Free shipping on all orders! <span className="font-semibold">No minimum purchase required.</span></span>
      </div>

      {/* 2. Main Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            {/* Custom SVG/Styled icon mimicking the colorful bar logo */}
            <div className="flex items-end gap-0.5 h-8 w-8 justify-center pb-1">
              <div className="w-1 h-4 bg-red-400 rounded-t-sm"></div>
              <div className="w-1 h-6 bg-green-500 rounded-t-sm"></div>
              <div className="w-1 h-7 bg-blue-400 rounded-t-sm"></div>
              <div className="w-1 h-5 bg-purple-400 rounded-t-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#2b4251] leading-none">
                smartbookstore<span className="text-[#5ca4a9]">.in</span>
              </span>
              <span className="text-[9px] text-gray-500 font-medium tracking-wider">
                employee owned. customer focused.
              </span>
            </div>
          </a>

          {/* Integrated Search Bar Wrapper */}
          <div className="flex-1 max-w-2xl mx-auto relative hidden md:flex items-center border  rounded-full bg-[#fcfcfc] hover:border-gray-400 focus-within:border-[#0f5b82] focus-within:ring-1 focus-within:ring-[#0f5b82] transition overflow-hidden">
            <div className="pl-4 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search by title or ISBN"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-2 pr-4 py-2.5 text-sm bg-transparent border-none outline-none focus:ring-0 text-gray-800 placeholder-gray-400"
            />
            
            {/* Split "Explore Books" Dropdown Button */}
            <button className="flex items-center gap-1 bg-[#f0f4f8] hover:bg-[#e1e9f0] border-l border-gray-200 text-[#0f5b82] text-xs font-bold uppercase tracking-wider px-4 py-3 shrink-0 transition">
              <span>Explore Books</span>
              <ChevronDown className="h-3 w-3 stroke-[3]" />
            </button>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Cart Button */}
            <a href="/cart" className="flex items-center gap-1.5 text-[#0f5b82] hover:text-[#0b4664] font-semibold text-sm transition">
              <div className="relative p-1">
                <ShoppingCart className="h-6 w-6 stroke-[1.75]" />
                <span className="absolute top-0 right-0 bg-[#0f5b82] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </div>
              <span className="hidden sm:inline">Cart</span>
            </a>

            {/* Sell Button */}
            {/* <a href="/sell" className="flex items-center gap-1.5 text-[#0f5b82] hover:text-[#0b4664] font-semibold text-sm transition">
              <div className="relative p-1">
                <DollarSign className="h-6 w-6 stroke-[1.75]" />
                <span className="absolute top-0 right-0 bg-[#0f5b82] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </div>
              <span className="hidden sm:inline">Sell</span>
            </a> */}

            {/* Sign In Button */}
            {/* <a href="/signin" className="bg-[#0f5b82] hover:bg-[#0b4664] text-white text-sm font-bold px-5 py-2 rounded-md shadow-sm transition">
              Sign In
            </a> */}
          </div>
        </div>

        {/* Mobile Search Bar (Visible only on small devices below md breakpoint) */}
        <div className="p-3 border-t border-gray-100 md:hidden bg-gray-50">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search by title or ISBN" 
              className="w-full text-sm outline-none border-none p-0 focus:ring-0"
            />
          </div>
        </div>
      </header>

      {/* 3. Main Content Slot */}
      <main className="min-h-[calc(100vh-280px)]">
        {children}
      </main>

      {/* 4. Organized Footer Layout */}
      <footer className="bg-[#f7f9fa] border-t border-gray-200 pt-12 pb-6 text-gray-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          <div>
            <h4 className="font-bold text-gray-800 mb-3 uppercase tracking-wider text-xs">Shop</h4>
            <ul className="space-y-2">
              <li><a href="/buy" className="hover:underline">Buy Books</a></li>
              <li><a href="/bestsellers" className="hover:underline">Bestsellers</a></li>
              <li><a href="/fiction" className="hover:underline">Fiction</a></li>
              <li><a href="/nonfiction" className="hover:underline">Non-Fiction</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-3 uppercase tracking-wider text-xs">Sell Books</h4>
            <ul className="space-y-2">
              <li><a href="/quote" className="hover:underline">Get a Quote</a></li>
              <li><a href="/buyback-cart" className="hover:underline">Buyback Cart</a></li>
              <li><a href="/buyback-faq" className="hover:underline">Buyback FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-3 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-2">
              <li><a href="/returns" className="hover:underline">Return Policy</a></li>
              <li><a href="/orders-faq" className="hover:underline">Orders FAQ</a></li>
              <li><a href="/shipping" className="hover:underline">Shipping Policy</a></li>
              <li><a href="/help" className="hover:underline">Help Center</a></li>
              <li><a href="/order-status" className="hover:underline">Order Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-3 uppercase tracking-wider text-xs">SmartBookstores.com</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex gap-4">
            <a href="/terms" className="hover:underline">Terms of Use</a>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/sitemap" className="hover:underline">Sitemap</a>
          </div>
          <p>© 2008 - 2026 Bookstores.com. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}