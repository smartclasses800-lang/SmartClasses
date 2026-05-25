import React, { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SiteShell from '../components/SiteShell'
import homebannerbg from '../assets/banner.jpeg'
import { loadBooks } from '../lib/bookCatalog'

const SELECTED_BOOK_KEY = 'selectedBookData'


function HomePage() {
  const topSellersRef = useRef(null)
  const topSellers = useMemo(() => loadBooks(), [])

  const handleBookSelect = (book) => {
    try {
      sessionStorage.setItem(SELECTED_BOOK_KEY, JSON.stringify(book))
    } catch {
      // ignore session storage errors
    }
  }

  // Scroll function for carousels
  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <SiteShell>
      {/* 1. Hero Banner Section */}
      <section className="relative bg-gray-100 border-b border-gray-200 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={homebannerbg} 
            alt="Reading background" 
            className="w-full h-full object-cover object-right md:object-center opacity-100"
          />
          {/* Light tint to keep text readable without washing out the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-slate-900/10 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[360px] sm:h-[460px] flex items-center relative z-10">
          <div className="max-w-xl">
            <p className="text-slate-100 font-medium text-lg sm:text-2xl mb-1 sm:mb-2 drop-shadow-sm">
              Welcome to Smart Book Store
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black leading-tight drop-shadow-sm">
              Your online bookstore for government Exam preparation.
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        
        {/* 2. Top Sellers Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Books</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll(topSellersRef, 'left')}
                className="p-2 border border-gray-300 rounded-full bg-white hover:bg-gray-50 text-gray-600 transition shadow-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scroll(topSellersRef, 'right')}
                className="p-2 bg-[#0f5b82] hover:bg-[#0b4664] rounded-full text-white transition shadow-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div 
            ref={topSellersRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
          >
            {topSellers.map((book, index) => (
              <Link
                key={index}
                to="/checkout"
                state={{ book }}
                onClick={() => handleBookSelect(book)}
                className="w-[140px] shrink-0 snap-start group sm:w-[200px]"
              >
                <div className="overflow-hidden rounded-[0.625rem] border border-[#d9e6ef] bg-white shadow-[0_10px_30px_-18px_rgba(15,91,130,0.45)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-18px_rgba(15,91,130,0.55)]">
                  <div className="aspect-[2/3] w-full overflow-hidden bg-[#f3f7fb]">
                    <img src={book.uri} alt={book.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="border-t border-[#e3edf5] p-3">
                    <h3 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#0f5b82]">
                      {book.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-1">by {book.author}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f5b82]">
                      View &amp; Pay
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>


      </div>
    </SiteShell>
  )
}

export default HomePage