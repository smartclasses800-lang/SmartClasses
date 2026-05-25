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
{/* 2. Main Sticky Header - with gradient bg like image 2 */}
<header className="sticky top-0 z-50 border-b border-gray-100 shadow-sm"
  style={{
    background: 'linear-gradient(135deg, #fff 0%, #fdf4fb 30%, #f0f4ff 60%, #eaf6fb 100%)'
  }}
>
  <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
    
    {/* Logo Section */}
    <a href="/" className="flex items-center gap-2 shrink-0">
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
          Punjab Government Exam Focused Bookstore
        </span>
      </div>
    </a>

    {/* ✅ FIXED Search Bar - single border, no double ring */}
    <div className="flex-1 max-w-2xl mx-auto relative hidden md:flex items-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-[0_8px_24px_rgba(15,91,130,0.08)] transition hover:border-gray-300 focus-within:border-[#0f5b82] focus-within:shadow-[0_0_0_3px_rgba(15,91,130,0.12)]">
      <div className="pl-4 text-gray-400 shrink-0">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        placeholder="Search by title or ISBN"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
      />
      <button className="flex h-full shrink-0 items-center gap-1 border-l border-gray-200 bg-white/80 px-5 text-xs font-semibold uppercase tracking-wider text-[#0f5b82] transition hover:bg-[#f0f4ff]">
        <span>Explore Books</span>
        <ChevronDown className="h-3 w-3 stroke-[2.75]" />
      </button>
    </div>

    {/* Right Navigation Actions */}
    <div className="flex items-center gap-4 sm:gap-6">
      <a href="/cart" className="flex items-center gap-1.5 text-[#0f5b82] hover:text-[#0b4664] font-semibold text-sm transition">
        <div className="relative p-1">
          <ShoppingCart className="h-6 w-6 stroke-[1.75]" />
          <span className="absolute top-0 right-0 bg-[#0f5b82] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            0
          </span>
        </div>
        <span className="hidden sm:inline">Cart</span>
      </a>
    </div>
  </div>

  {/* Mobile Search */}
  <div className="p-3 border-t border-gray-100 md:hidden bg-gray-50">
    <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-2">
      <Search className="h-4 w-4 text-gray-400 mr-2" />
      <input 
        type="text" 
        placeholder="Search by title or ISBN" 
        className="w-full text-sm outline-none border-none p-0"
      />
    </div>
  </div>
</header>

      {/* 3. Main Content Slot */}
      <main className="min-h-[calc(100vh-280px)]">
        {children}
      </main>

      {/* 4. Simplified Footer */}
      <footer className="bg-[#f7f9fa] border-t border-gray-200 py-8 text-gray-600 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-gray-700">
            <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            <a href="/shipping-policy" className="hover:underline">Shipping Policy</a>
            <a href="/cancellation-refund-policy" className="hover:underline">Cancellation &amp; Refund</a>
            <a href="/terms-and-conditions" className="hover:underline">Terms &amp; Conditions</a>
            <a href="/contact-us" className="hover:underline">Contact Us</a>
          </div>

          <p className="mt-5 text-center text-sm text-gray-700">
            Support: +91 8054643829 | smartclasses800@gmail.com
          </p>

          <p className="mt-3 text-center text-xs text-gray-500">
            © 2026 ILLAM-E-PUNJAB. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}