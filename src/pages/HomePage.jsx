import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Loader2, Search, X, ChevronDown, MessageCircle } from 'lucide-react'
import SiteShell from '../components/SiteShell'
import homebannerbg from '../assets/banner.jpeg'
import { fetchBooks } from '../lib/booksApi'

const SELECTED_BOOK_KEY = 'selectedBookData'

const FAQS = [
  {
    q: 'Which exams are these books for?',
    a: 'We provide books specifically for Punjab Government Exams including Punjab Police Constable, Patwari, PSSSB, PPSC, and other state-level recruitment exams.',
  },
  {
    q: 'What languages are available?',
    a: 'Books are available in English and Punjabi. You can select your preferred language during the payment/checkout process.',
  },
  {
    q: 'What is your return and refund policy?',
    a: 'We do not offer returns or refunds once an order is placed and confirmed. Please review your order carefully before making payment.',
  },
  {
    q: 'I am unable to make payment via Razorpay. What should I do?',
    a: 'No worries! Contact us at +91 8054643829 or email smartclasses800@gmail.com. We will directly send you a QR code and confirm your order manually.',
  },
  {
    q: 'How do I contact support?',
    a: 'You can reach us at +91 8054643829 (call/WhatsApp) or email us at smartclasses800@gmail.com. We are happy to help!',
  },
]

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#e3edf5] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-[#0f5b82] transition">
          {faq.q}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#0f5b82] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-600 leading-relaxed pr-6">{faq.a}</p>
      )}
    </div>
  )
}

function HomePage() {
  const topSellersRef = useRef(null)
  const [topSellers, setTopSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true
    async function loadCatalog() {
      try {
        const books = await fetchBooks()
        if (active) setTopSellers(books)
      } catch {
        if (active) setTopSellers([])
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCatalog()
    return () => { active = false }
  }, [])

  const handleBookSelect = (book) => {
    try {
      sessionStorage.setItem(SELECTED_BOOK_KEY, JSON.stringify(book))
    } catch { }
  }

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth * 0.75
        : scrollLeft + clientWidth * 0.75
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const filteredBooks = searchQuery.trim()
    ? topSellers.filter(b =>
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.isbn?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topSellers

  const isSearching = searchQuery.trim().length > 0

  return (
    <SiteShell searchQuery={searchQuery} setSearchQuery={setSearchQuery}>

      {/* Hero Banner — hidden when searching */}
      {!isSearching && (
        <section className="relative bg-gray-100 border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={homebannerbg}
              alt="Reading background"
              className="w-full h-full object-cover object-right md:object-center"
            />
            {/* Stronger gradient on mobile so text is always readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/50 to-slate-900/20 md:from-slate-950/30 md:via-slate-900/10 md:to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[280px] sm:h-[460px] flex items-center relative z-10">
            <div className="max-w-xl">
              <p className="text-slate-200 font-medium text-base sm:text-2xl mb-1 sm:mb-2">
                Welcome to Smart Book Store
              </p>
              <h1 className="text-2xl sm:text-5xl font-bold tracking-tight text-white leading-snug">
                Your online bookstore for government Exam preparation.
              </h1>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">

        {/* ── Books Section ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {isSearching ? `Results for "${searchQuery}"` : 'All Books'}
            </h2>
            {/* Scroll arrows — desktop only */}
            {!isSearching && (
              <div className="hidden sm:flex gap-2">
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
            )}
          </div>

          {loading && (
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#d9e6ef] bg-white px-6 py-10 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin text-[#0f5b82]" /> Loading books...
            </div>
          )}

          {!loading && filteredBooks.length === 0 && (
            <div className="w-full rounded-2xl border border-dashed border-[#d9e6ef] bg-white px-6 py-10 text-center text-sm text-slate-600">
              {isSearching ? 'No books match your search.' : 'No books available yet. Please check back soon.'}
            </div>
          )}

          {/* MOBILE: 2-column grid */}
          {!loading && filteredBooks.length > 0 && (
            <>
              {/* Mobile grid (hidden on sm+) */}
              <div className="grid grid-cols-2 gap-3 sm:hidden">
                {filteredBooks.map((book) => (
                  <BookCard key={book.sku} book={book} onSelect={handleBookSelect} />
                ))}
              </div>

              {/* Desktop carousel (hidden on mobile) */}
              <div
                ref={topSellersRef}
                className="hidden sm:flex gap-4 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
              >
                {filteredBooks.map((book) => (
                  <Link
                    key={book.sku}
                    to="/checkout"
                    state={{ book }}
                    onClick={() => handleBookSelect(book)}
                    className="w-[200px] shrink-0 snap-start group"
                  >
                    <BookCardInner book={book} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ── FAQ Section ── */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">
            Frequently Asked Questions
          </h2>
          <div className="rounded-2xl border border-[#d9e6ef] bg-white px-5 sm:px-8 divide-y-0">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </section>

      </div>

      {/* ── Floating WhatsApp Button ── */}
      <a
        href="https://wa.me/918054643829"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-5 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.45)] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,211,102,0.5)]"
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp SVG icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-5 w-5 fill-white shrink-0">
          <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.364.638 4.651 1.848 6.651L2.667 29.333l6.88-1.805A13.285 13.285 0 0016.003 29.333C23.363 29.333 29.333 23.363 29.333 16S23.363 2.667 16.003 2.667zm0 24.267a11.013 11.013 0 01-5.617-1.542l-.403-.24-4.082 1.07 1.09-3.977-.263-.408A10.988 10.988 0 015.015 16c0-6.065 4.935-11 10.988-11 6.065 0 11 4.935 11 11s-4.935 11-10.988 11zm6.032-8.24c-.33-.165-1.953-.963-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.853 1.073-1.045 1.293-.193.22-.385.248-.715.083-.33-.165-1.393-.514-2.654-1.637-.98-.875-1.643-1.954-1.835-2.284-.193-.33-.021-.508.145-.672.15-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.743-1.79-1.018-2.45-.267-.643-.54-.555-.743-.565-.193-.01-.413-.012-.633-.012s-.578.083-.88.413c-.303.33-1.155 1.128-1.155 2.75s1.183 3.19 1.348 3.41c.165.22 2.327 3.554 5.64 4.984.789.34 1.404.543 1.884.695.792.252 1.513.216 2.082.131.635-.094 1.953-.798 2.228-1.57.275-.77.275-1.43.193-1.57-.083-.138-.303-.22-.633-.385z"/>
        </svg>
        <span className="text-sm font-semibold hidden sm:inline">Chat with Us</span>
      </a>

    </SiteShell>
  )
}

// Shared card inner UI
function BookCardInner({ book }) {
  console.log('BookCardInner render:', book) // Debug log to check book data
  return (
    <div className="overflow-hidden rounded-[0.625rem] border border-[#d9e6ef] bg-white shadow-[0_10px_30px_-18px_rgba(15,91,130,0.45)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-18px_rgba(15,91,130,0.55)]">
      <div className="aspect-[2/3] w-full overflow-hidden bg-[#f3f7fb]">
        <img src={book.uri} alt={book.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="border-t border-[#e3edf5] p-3">
        <h3 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#0f5b82]">
          {book.title}
        </h3>
        <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-1">by {book.author}</p>
        <p className="mt-1 text-[11px] font-semibold text-slate-700">
          Rs. {book.price ?? Math.round(Number(book.pricePaise || 0) / 100)}
        </p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f5b82]">
          View &amp; Pay
        </p>
      </div>
    </div>
  )
}

// Mobile card (Link wrapper included)
function BookCard({ book, onSelect }) {
  return (
    <Link
      to="/checkout"
      state={{ book }}
      onClick={() => onSelect(book)}
      className="group"
    >
      <BookCardInner book={book} />
    </Link>
  )
}

export default HomePage