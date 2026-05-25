import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SiteShell from '../components/SiteShell'
import homebannerbg from '../assets/banner.jpeg'

// Top Sellers Book Data directly matching the live catalog
const topSellers = [
  { title: 'Illami Punjab', author: 'Rebecca Yarros', cover: '/covers/fourth-wing.jpg' },
  { title: 'Punjabi Bhasha Ate Vyakaran', author: 'Charlie Kirk', cover: '/covers/stop-god.jpg' },
  { title: 'Punjab Police Constable 2026 District & Armed Cadre', author: 'Allen Levi', cover: '/covers/theo.jpg' },
  // { title: 'The Let Them Theory', author: 'Mel Robbins', cover: '/covers/let-them.jpg' },
  // { title: 'Sunrise on the Reaping', author: 'Suzanne Collins', cover: '/covers/sunrise.jpg' },
  // { title: 'Patriot', author: 'Alexei Navalny', cover: '/covers/patriot.jpg' },
  // { title: 'Melania', author: 'Melania Trump', cover: '/covers/melania.jpg' },
  // { title: 'Original Sin', author: 'Jake Tapper, Alex Thompson', cover: '/covers/original-sin.jpg' },
  // { title: 'The Idaho Four', author: 'James Patterson, Vicky Ward', cover: '/covers/idaho-four.jpg' },
  // { title: 'Framed', author: 'John Grisham, Jim McCloskey', cover: '/covers/framed.jpg' }
]

// Textbook Best Sellers Data matching the live catalog
const textbookSellers = [
  { title: 'Substance Use Counseling: Theory And Practice', author: 'Stevens', cover: '/covers/substance.jpg' },
  { title: 'When The Light Finds Us From A Life Sentence To A Life Transformed', author: 'Unknown', cover: '/covers/light.jpg' },
  { title: 'Heating, Cooling, Lighting Sustainable Design Strategies', author: 'Lechner', cover: '/covers/heating.jpg' },
  { title: 'Acceptance And Commitment Therapy', author: 'Hayes', cover: '/covers/acceptance.jpg' },
  { title: 'Forensic Analytics Methods And Techniques', author: 'Nigrini', cover: '/covers/forensic.jpg' }
]

function HomePage() {
  const topSellersRef = useRef(null)
  const textbooksRef = useRef(null)

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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Top sellers</h2>
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
              <div key={index} className="w-[140px] sm:w-[170px] shrink-0 snap-start group cursor-pointer">
                <div className="aspect-[2/3] w-full rounded-md bg-gray-100 border border-gray-200 overflow-hidden shadow-sm group-hover:shadow-md transition">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="mt-2 text-xs font-bold text-gray-800 line-clamp-1 group-hover:underline">{book.title}</h3>
                <p className="text-[11px] text-gray-500 line-clamp-1">by {book.author}</p>
              </div>
            ))}
          </div>
        </section>


      </div>
    </SiteShell>
  )
}

export default HomePage