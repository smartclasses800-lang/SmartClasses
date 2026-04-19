import { Link } from 'react-router-dom'

const supportPhone = import.meta.env.VITE_SUPPORT_PHONE || '+91 85588 00797'
const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'illamerpunjab@gmail.com'

function SiteShell({ children }) {
  return (
    <div className="text-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-[#eadfdf] bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="title-font text-lg font-bold tracking-wide text-[var(--maroon)] sm:text-xl"
          >
            ILLAM-E-PUNJAB
          </Link>
          <Link
            to="/checkout"
            className="rounded-md bg-[var(--maroon)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--maroon-hover)]"
          >
            Buy Now
          </Link>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#ebdfdf] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
            <Link to="/privacy-policy" className="hover:text-[var(--maroon)]">
              Privacy Policy
            </Link>
            <Link to="/shipping-policy" className="hover:text-[var(--maroon)]">
              Shipping Policy
            </Link>
            <Link
              to="/cancellation-refund-policy"
              className="hover:text-[var(--maroon)]"
            >
              Cancellation & Refund
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-[var(--maroon)]">
              Terms & Conditions
            </Link>
            <Link to="/contact-us" className="hover:text-[var(--maroon)]">
              Contact Us
            </Link>
          </div>
          <div className="text-sm text-slate-600">
            <p>Support: {supportPhone} | {supportEmail}</p>
            <p className="mt-2">© 2026 ILLAM-E-PUNJAB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SiteShell
