import {
  BookOpenText,
  CalendarCheck2,
  CircleCheckBig,
  ScrollText,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell'

const features = [
  {
    title: 'Punjab History, Culture & Geography',
    description:
      'Focused coverage of Punjab history, culture, and geography for state-level and competitive exam preparation.',
    icon: BookOpenText,
  },
  {
    title: 'Exam Preparation Focus',
    description:
      'Useful for Punjab-focused exams, with content designed around common syllabus areas used by aspirants.',
    icon: ScrollText,
  },
  {
    title: 'English & Punjabi Medium',
    description:
      'Available in both English and Punjabi medium variants so students can choose their preferred language.',
    icon: CalendarCheck2,
  },
]

function HomePage() {
  return (
    <SiteShell>
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-20">
        <div className="pointer-events-none absolute -right-32 -top-28 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#f8e4ab]/60 via-[#eab6b7]/40 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-[#7b181b]/10 to-transparent blur-2xl" />

        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#f0d898] bg-gradient-to-r from-[#fef3d0] to-[#fbecc8] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--maroon)] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--maroon)]" />
            Punjab History Exam Guide
          </p>
          <h1 className="title-font mt-4 text-5xl font-bold leading-[1.05] text-[var(--maroon)] sm:text-6xl lg:text-7xl">
            ILLAM-E-PUNJAB
            <span className="mt-3 block text-2xl font-semibold text-[var(--maroon)]/70 sm:text-3xl lg:text-4xl">
              for Punjab Exam Preparation
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
            A concise book for Punjab history, culture, and geography published by
            Twentyfirst Century Publications. Available in English and Punjabi
            medium editions for exam aspirants.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, #9b1e22 0%, #7b181b 50%, #5a1013 100%)',
                boxShadow: '0 8px 24px -4px rgba(123,24,27,0.45), 0 0 0 1px rgba(123,24,27,0.2)',
              }}
            >
              Buy Now
            </Link>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--gold)]/20 px-3 py-1 text-sm font-semibold text-[var(--maroon)]">
              <CircleCheckBig className="h-4 w-4" /> Paperback | 390 pages | 2025-2026 editions
            </span>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-sm lg:max-w-md">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-[#f8d878] via-[#f5c5c6] to-[#e8a0a2] opacity-60 blur-2xl" />
          <div className="absolute -inset-1 -z-0 rounded-[1.5rem] bg-gradient-to-tr from-[var(--gold)] to-[#eab6b7] opacity-40" />
          <img
            src="/book.webp"
            alt="ILLAM-E-PUNJAB book cover"
            className="relative w-full rounded-2xl border border-[#ecd8d8] bg-white object-cover p-3 shadow-[0_32px_64px_-20px_rgba(123,24,27,0.5)]"
            style={{ transform: 'rotate(-2deg)' }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <h2 className="title-font text-center text-3xl font-bold text-[var(--maroon)] sm:text-4xl">
          Why This Book?
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-2 hover:shadow-xl"
                style={{
                  background:
                    'linear-gradient(white, white) padding-box, linear-gradient(135deg, #f8d878, #eab6b7) border-box',
                  border: '1.5px solid transparent',
                }}
              >
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-[#fbecc8] to-[#f5c5c6] p-3 text-[var(--maroon)] shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--maroon)]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div
          className="relative mx-auto max-w-xl overflow-hidden rounded-3xl p-8 text-center"
          style={{
            background: 'linear-gradient(145deg, #7b181b 0%, #9b2e31 40%, #5a1013 100%)',
            boxShadow: '0 32px 64px -16px rgba(123,24,27,0.6)',
          }}
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-white/5" />
          <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-[#f8d878]">
            Limited Time Offer
          </p>
          <p className="title-font relative mt-3 text-5xl font-bold text-white sm:text-6xl">
            Rs. 650
          </p>
          <p className="relative mt-3 text-white/75">
            One-time purchase, 2026 edition, free shipping via India Post.
          </p>
          <Link
            to="/checkout"
            className="relative mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#f8d878] px-6 py-4 text-base font-bold text-[var(--maroon)] transition hover:bg-[#f5ce60]"
            style={{ boxShadow: '0 4px 16px rgba(248,216,120,0.4)' }}
          >
            Purchase Now {'>'}
          </Link>
          <p className="relative mt-4 text-sm font-semibold text-white/70">
            Get your copy today and start your winning prep journey now.
          </p>
        </div>
      </section>

      <section className="bg-[var(--muted-bg)] py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="title-font text-3xl font-bold text-[var(--maroon)] sm:text-4xl">
            About the Book
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg">
            ILLAM-E-PUNJAB is listed as a concise preparation book covering Punjab
            history, culture, and geography. Current listings indicate separate
            English and Punjabi medium editions from Twentyfirst Century
            Publications.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#eadcdc] bg-white p-8 text-center shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)]">
            Pricing & Purchase
          </p>
          <h2 className="title-font mt-3 text-4xl font-bold text-[var(--maroon)]">Rs. 650</h2>
          <p className="mt-3 text-slate-700">
            One-time purchase with full access to the latest 2026 edition.
          </p>
          <Link
            to="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[var(--maroon)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--maroon-hover)]"
          >
            Purchase Now
          </Link>
        </div>
      </section>

      <section className="bg-white pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="title-font text-3xl font-bold text-[var(--maroon)] sm:text-4xl">
            ILLAM-E-PUNJAB Book FAQs
          </h2>
          <div className="mt-6 space-y-4">
            <article className="rounded-xl border-l-4 border-[var(--maroon)] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--maroon)]">
                What is ILLAM-E-PUNJAB book used for?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
                ILLAM-E-PUNJAB is used for Punjab exam preparation with focus areas
                in Punjab history, culture, and geography.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-[var(--maroon)] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--maroon)]">
                Is ILLAM-E-PUNJAB available in English and Punjabi?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
                Yes, listings indicate English medium and Punjabi medium editions.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-[var(--maroon)] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--maroon)]">
                How can I buy ILLAM-E-PUNJAB online?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
                Click Buy Now, fill your details, choose language medium, and
                complete secure payment through Razorpay checkout.
              </p>
            </article>
          </div>
        </div>
      </section>
      <a
        href={`https://wa.me/918054643829?text=${encodeURIComponent('Hello, I need help with my order')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#1ebe57]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.92 11.92 0 0012.03.5C6.06.5 1.17 5.39 1.17 11.36c0 2.01.53 3.97 1.54 5.69L.5 23.5l6.72-2.02a12.04 12.04 0 005.32 1.2h.01c6 0 10.89-4.89 10.89-10.86 0-2.92-1.14-5.66-3.22-7.34zM12.03 21.5c-1.63 0-3.23-.44-4.63-1.27l-.33-.19-3.99 1.2 1.22-3.87-.21-.36A8.87 8.87 0 013.17 11.36c0-4.94 4.02-8.96 8.86-8.96 2.37 0 4.6.92 6.28 2.6 1.67 1.67 2.6 3.9 2.6 6.28 0 4.94-4.02 8.96-8.86 8.96z" />
          <path d="M17.35 14.14c-.29-.15-1.71-.84-1.97-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.16.19-.32.21-.6.07-.29-.15-1.23-.45-2.34-1.44-.87-.77-1.46-1.72-1.63-2-.17-.29-.02-.45.12-.6.12-.12.29-.32.44-.48.15-.16.19-.26.29-.43.1-.16.04-.31-.02-.48-.06-.16-.64-1.55-.88-2.13-.23-.56-.46-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.45 0 1.45 1.03 2.86 1.17 3.06.15.19 2.02 3.1 4.9 4.35 2.88 1.26 2.88.84 3.4.79.52-.05 1.71-.7 1.95-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z" fill="#fff" />
        </svg>
      </a>
    </SiteShell>
  )
}

export default HomePage
