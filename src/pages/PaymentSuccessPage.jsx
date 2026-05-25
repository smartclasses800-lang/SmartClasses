import { CircleCheckBig } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import SiteShell from '../components/SiteShell'

function PaymentSuccessPage() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const paymentId = queryParams.get('paymentId') || 'N/A'
  const orderId = queryParams.get('orderId') || 'N/A'

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <article className="rounded-2xl border border-[#e8dddd] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto w-fit rounded-full bg-[#edf8ef] p-3 text-[#1d7f3f]">
            <CircleCheckBig className="h-8 w-8" />
          </div>
          <h1 className="title-font mt-5 text-3xl font-bold text-[var(--maroon)] sm:text-4xl">
            Payment Received Successfully
          </h1>
          <p className="mt-3 text-slate-700">
            Thank you for ordering Smart Book Store. You will receive a confirmation
            email and tracker ID once shipment is booked through India Post.
          </p>

          <div className="mx-auto mt-7 max-w-lg rounded-lg bg-[#faf7f7] p-4 text-left text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Payment ID:</span>{' '}
              {paymentId}
            </p>
            <p className="mt-2">
              <span className="font-semibold text-slate-900">Order ID:</span> {orderId}
            </p>
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex rounded-md bg-[var(--maroon)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--maroon-hover)]"
          >
            Back to Home
          </Link>
        </article>
      </section>
    </SiteShell>
  )
}

export default PaymentSuccessPage
