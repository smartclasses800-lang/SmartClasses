import React from 'react';
import { Search, ShoppingCart, ChevronDown, X } from 'lucide-react';

export default function SiteShell({ children, searchQuery = '', setSearchQuery }) {
  const isSearching = searchQuery.trim().length > 0

  const handleChange = (e) => {
    if (setSearchQuery) setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    if (setSearchQuery) setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#333333]">

      {/* 1. Announcement Bar */}
      <div className="bg-[#fff8f0] text-center py-2 px-4 text-xs sm:text-sm font-medium border-b border-[#f3dec3]">
        <span className="text-[#b45309] font-semibold">
          Free shipping on all orders!{' '}
          <span className="font-bold">No minimum purchase required.</span>
        </span>
      </div>

      {/* 2. Sticky Header */}
      <header
        className="sticky top-0 z-50 border-b border-gray-100 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #fff 0%, #fdf4fb 30%, #f0f4ff 60%, #eaf6fb 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-3">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-end gap-0.5 h-7 w-7 justify-center pb-0.5">
              <div className="w-1 h-3.5 bg-red-400 rounded-t-sm" />
              <div className="w-1 h-5 bg-green-500 rounded-t-sm" />
              <div className="w-1 h-6 bg-blue-400 rounded-t-sm" />
              <div className="w-1 h-4 bg-purple-400 rounded-t-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold tracking-tight text-[#2b4251] leading-none">
                smartbookstore<span className="text-[#5ca4a9]">.in</span>
              </span>
              <span className="text-[8px] sm:text-[9px] text-gray-500 font-medium tracking-wider hidden sm:block">
                Punjab Government Exam Focused Bookstore
              </span>
            </div>
          </a>

          {/* Desktop Search */}
          <div className="flex-1 max-w-2xl mx-auto relative hidden md:flex items-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-[0_8px_24px_rgba(15,91,130,0.08)] transition hover:border-gray-300 focus-within:border-[#0f5b82] focus-within:shadow-[0_0_0_3px_rgba(15,91,130,0.12)]">
            <div className="pl-4 text-gray-400 shrink-0">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search by title, author or ISBN"
              value={searchQuery}
              onChange={handleChange}
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
            {isSearching && (
              <button
                onClick={clearSearch}
                className="pr-3 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button className="flex h-full shrink-0 items-center gap-1 border-l border-gray-200 bg-white/80 px-5 text-xs font-semibold uppercase tracking-wider text-[#0f5b82] transition hover:bg-[#f0f4ff]">
              <span>Explore</span>
              <ChevronDown className="h-3 w-3 stroke-[2.75]" />
            </button>
          </div>

          {/* Cart */}
          <a href="/cart" className="flex items-center gap-1.5 text-[#0f5b82] hover:text-[#0b4664] font-semibold text-sm transition shrink-0">
            <div className="relative p-1">
              <ShoppingCart className="h-6 w-6 stroke-[1.75]" />
              <span className="absolute top-0 right-0 bg-[#0f5b82] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </div>
            <span className="hidden sm:inline">Cart</span>
          </a>
        </div>

        {/* Mobile Search Bar — clean single border */}
        <div className="md:hidden px-3 pb-3 pt-1">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm focus-within:border-[#0f5b82] focus-within:shadow-[0_0_0_2px_rgba(15,91,130,0.1)] transition">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by title, author or ISBN"
              value={searchQuery}
              onChange={handleChange}
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none border-none px-2 placeholder:text-gray-400"
            />
            {isSearching && (
              <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600 shrink-0">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-280px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#f7f9fa] border-t border-gray-200 py-8 text-gray-600 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-medium text-gray-700">
            <a href="/privacy-policy" className="hover:text-[#0f5b82] hover:underline transition">Privacy Policy</a>
            <a href="/shipping-policy" className="hover:text-[#0f5b82] hover:underline transition">Shipping Policy</a>
            <a href="/cancellation-refund-policy" className="hover:text-[#0f5b82] hover:underline transition">Cancellation &amp; Refund</a>
            <a href="/terms-and-conditions" className="hover:text-[#0f5b82] hover:underline transition">Terms &amp; Conditions</a>
            <a href="/contact-us" className="hover:text-[#0f5b82] hover:underline transition">Contact Us</a>
          </div>
          <p className="mt-5 text-center text-sm text-gray-700">
            Support: +91 8054643829 | smartclasses800@gmail.com
          </p>
          <p className="mt-3 text-center text-xs text-gray-500">
            © 2026 SMART BOOK STORE. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}