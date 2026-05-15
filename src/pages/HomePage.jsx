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
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <div>
          <p className="inline-flex items-center rounded-full bg-[#fbecc8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--maroon)]">
            Punjab History Exam Guide
          </p>
          <h1 className="title-font mt-5 text-4xl font-bold leading-tight text-[var(--maroon)] sm:text-5xl lg:text-6xl">
            ILLAM-E-PUNJAB for Punjab Exam Preparation
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
            A concise book for Punjab history, culture, and geography published by
            Twentyfirst Century Publications. Available in English and Punjabi
            medium editions for exam aspirants.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center rounded-md bg-[var(--maroon)] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-[#7b181b]/20 transition hover:bg-[var(--maroon-hover)]"
            >
              Buy Now
            </Link>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--gold)]/20 px-3 py-1 text-sm font-semibold text-[var(--maroon)]">
              <CircleCheckBig className="h-4 w-4" /> Paperback | 390 pages | 2025-2026 editions
            </span>
          </div>
        </div>

        <div className="relative mx-auto max-w-sm lg:max-w-md">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#f8e4ab] via-white to-[#eab6b7] blur-xl" />
          <img
            src="/book.webp"
            alt="ILLAM-E-PUNJAB book cover"
            className="w-full rounded-2xl border border-[#ecd8d8] bg-white object-cover p-2 shadow-[0_24px_45px_-18px_rgba(123,24,27,0.45)]"
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
                className="rounded-xl border border-[#ecdede] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-[#f8ebeb] p-3 text-[var(--maroon)]">
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
        <div className="rounded-xl bg-[var(--gold)] px-6 py-5 text-center shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--maroon)]">
            Limited Time Offer
          </p>
          <p className="mt-1 text-lg font-extrabold text-[var(--maroon)] sm:text-2xl">
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
          <h2 className="title-font mt-3 text-4xl font-bold text-[var(--maroon)]">Rs. 699</h2>
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
            <article className="rounded-xl border border-[#ebdddd] p-5">
              <h3 className="text-lg font-bold text-[var(--maroon)]">
                What is ILLAM-E-PUNJAB book used for?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
                ILLAM-E-PUNJAB is used for Punjab exam preparation with focus areas
                in Punjab history, culture, and geography.
              </p>
            </article>
            <article className="rounded-xl border border-[#ebdddd] p-5">
              <h3 className="text-lg font-bold text-[var(--maroon)]">
                Is ILLAM-E-PUNJAB available in English and Punjabi?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">
                Yes, listings indicate English medium and Punjabi medium editions.
              </p>
            </article>
            <article className="rounded-xl border border-[#ebdddd] p-5">
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
    </SiteShell>
  )
}

export default HomePage
