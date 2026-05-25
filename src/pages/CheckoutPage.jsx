import { useEffect, useState } from 'react'
import { AlertTriangle, BookOpen, CheckCircle2, Star } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import SiteShell from '../components/SiteShell'
import { savePendingOrder } from '../lib/orderStore'
import { loadRazorpayScript } from '../lib/razorpay'

const supportPhone = import.meta.env.VITE_SUPPORT_PHONE || '+91 85588 00797'
const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'illamerpunjab@gmail.com'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || ''
const SELECTED_BOOK_KEY = 'selectedBookData'

const STORAGE_KEY = 'checkoutFormData'

const defaultBook = {
  sku: 'illam-e-punjab-book',
  title: 'ILLAM-E-PUNJAB',
  author: 'Smart Book Store',
  uri: '/book.webp',
  description: 'The active book catalog entry currently configured for direct payment.',
  pages: 0,
  bilangual: false,
  onlyEnglish: true,
  onpunjabi: false,
}

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  medium: 'English Medium',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  district: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
}

function getSavedFormState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...initialFormState, ...parsed }
    }
  } catch {
    // ignore parse errors
  }
  return initialFormState
}

function getSavedBookState() {
  try {
    const raw = sessionStorage.getItem(SELECTED_BOOK_KEY)
    if (raw) {
      return { ...defaultBook, ...JSON.parse(raw) }
    }
  } catch {
    // ignore parse errors
  }

  return defaultBook
}

function formatPriceLabel(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Rs. 699'
  }

  return `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`
}

function getLanguageBadges(book) {
  const badges = []

  if (book?.bilangual || book?.bilingual) {
    badges.push('Bilingual edition')
  }

  if (book?.onlyEnglish) {
    badges.push('Only English')
  }

  if (book?.onpunjabi) {
    badges.push('Punjabi focused')
  }

  return badges
}

function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedBook = { ...getSavedBookState(), ...(location.state?.book || {}) }
  const [formData, setFormData] = useState(getSavedFormState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  }, [formData])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [formattedPrice, setFormattedPrice] = useState('Rs. 699')

  useEffect(() => {
    let mounted = true
    async function loadPrice() {
      if (!apiBaseUrl) return
      try {
        const resp = await fetch(`${apiBaseUrl}/products/${selectedBook.sku || 'illam-e-punjab-book'}`)
        if (!resp.ok) return
        const json = await resp.json()
        if (!mounted) return
        const p = json.pricePaise || 69900
        setFormattedPrice(`Rs. ${(p / 100).toFixed(0)}`)
      } catch (e) {
        // ignore and keep default
      }
    }
    loadPrice()
    return () => {
      mounted = false
    }
  }, [selectedBook.sku])

  useEffect(() => {
    try {
      sessionStorage.setItem(SELECTED_BOOK_KEY, JSON.stringify(selectedBook))
    } catch {
      // ignore session storage errors
    }
  }, [selectedBook])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!apiBaseUrl || !razorpayKeyId) {
      setError('Payment is not configured yet. Add VITE_API_BASE_URL and VITE_RAZORPAY_KEY_ID in .env first.')
      return
    }

    setLoading(true)

    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Unable to load Razorpay checkout. Please check your network and try again.')
      }

      const payload = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          medium: formData.medium,
        },
        shippingAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          landmark: formData.landmark,
          district: formData.district,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
        product: {
          sku: selectedBook.sku || 'illam-e-punjab-book',
          title: selectedBook.title || 'ILLAM-E-PUNJAB',
          quantity: 1,
        },
      }

      const response = await fetch(`${apiBaseUrl}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create order. Please verify backend endpoint and try again.')
      }

      const order = await response.json()
      if (!order?.orderId || !order?.amount || !order?.currency) {
        throw new Error('Invalid order response from backend. Expected orderId, amount, currency.')
      }

      savePendingOrder({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        createdAt: new Date().toISOString(),
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          medium: formData.medium,
        },
        shippingAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          landmark: formData.landmark,
          district: formData.district,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
      })

      const razorpay = new window.Razorpay({
        key: order.keyId || razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: selectedBook.title || 'ILLAM-E-PUNJAB',
        description: selectedBook.description || 'Punjab History Book Purchase',
        order_id: order.orderId,
        image: selectedBook.uri || '/book.webp',
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          bookTitle: selectedBook.title || 'ILLAM-E-PUNJAB',
          bookAuthor: selectedBook.author || 'Smart Book Store',
          medium: formData.medium,
          district: formData.district,
          fullShippingAddress:
            `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.district}, ${formData.state}, ${formData.pincode}, ${formData.country}`,
        },
        theme: {
          color: '#7B181B',
        },
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(`${apiBaseUrl}/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id || order.orderId,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment completed but backend verification failed.')
            }

            localStorage.removeItem(STORAGE_KEY)
            const params = new URLSearchParams({
              paymentId: paymentResponse.razorpay_payment_id || '',
              orderId: paymentResponse.razorpay_order_id || order.orderId,
            })
            navigate(`/payment-success?${params.toString()}`)
          } catch (verifyError) {
            setError(verifyError.message || 'Payment verification failed.')
          }
        },
      })

      razorpay.open()
    } catch (submitError) {
      setError(submitError.message || 'Could not initialize payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          <article className="overflow-hidden rounded-[2rem] border border-[#dfd1d2] bg-white/95 shadow-[0_24px_70px_-34px_rgba(123,24,27,0.3)] backdrop-blur">
            <div
              className="border-b border-[#ecdcdc] px-5 py-5 sm:px-8"
              style={{ background: 'linear-gradient(135deg, #fffdfb 0%, #fff4f4 100%)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d6a6c]">
                Selected Book
              </p>
              <div className="mt-4 grid gap-5 xl:grid-cols-[260px_1fr] xl:items-start">
                <div className="mx-auto w-full max-w-[180px] overflow-hidden rounded-[1.6rem] border border-[#e8d7d8] bg-[#fbf4f4] shadow-[0_16px_40px_-28px_rgba(123,24,27,0.35)] sm:max-w-[210px] xl:max-w-none">
                  <img
                    src={selectedBook.uri || '/book.webp'}
                    alt={selectedBook.title}
                    className="aspect-[2/3] w-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <p className="title-font text-3xl font-bold tracking-tight text-[var(--maroon)] sm:text-4xl">
                    {selectedBook.title}
                  </p>
                  <p className="mt-2 text-base text-slate-600">
                    by <span className="font-semibold text-slate-900">{selectedBook.author}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {getLanguageBadges(selectedBook).map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center rounded-full border border-[#ecd0d1] bg-white px-3 py-1 text-xs font-semibold text-[var(--maroon)]"
                      >
                        {badge}
                      </span>
                    ))}
                    <span className="inline-flex items-center rounded-full border border-[#ecd0d1] bg-white px-3 py-1 text-xs font-semibold text-[var(--maroon)]">
                      {selectedBook.pages ? `${selectedBook.pages} pages` : 'Curated edition'}
                    </span>
                  </div>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
                    {selectedBook.description || 'This selected book is preloaded from the home page and ready for direct Razorpay checkout.'}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3 xl:hidden">
                    <div className="rounded-2xl border border-[#eadede] bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Price
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{formattedPrice}</p>
                    </div>
                    <div className="rounded-2xl border border-[#eadede] bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Payment
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">Razorpay</p>
                    </div>
                    <div className="rounded-2xl border border-[#eadede] bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Support
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">Phone + email</p>
                    </div>
                  </div>

                  <div className="mt-6 hidden gap-3 sm:grid-cols-3 xl:grid">
                    <div className="rounded-2xl border border-[#eadede] bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Payment Mode
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">Direct Razorpay</p>
                    </div>
                    <div className="rounded-2xl border border-[#eadede] bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Shipping
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">India Post</p>
                    </div>
                    <div className="rounded-2xl border border-[#eadede] bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Support
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">Email + phone follow-up</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-[1.6rem] border border-[#f0e1e2] bg-[#fffaf7] p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--maroon)]">
                  <Star className="h-4 w-4" />
                  Direct checkout is ready. Fill the delivery details below and continue to payment.
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Full Name
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={updateField}
                    required
                    className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                    placeholder="Enter full name"
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Email ID
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={updateField}
                    required
                    className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                    placeholder="name@example.com"
                  />
                </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Phone Number
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={updateField}
                    required
                    pattern="[0-9]{10}"
                    className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                    placeholder="10 digit mobile number"
                  />
                </label>

                <fieldset className="rounded-md border border-[#dac6c7] px-3 py-2">
                  <legend className="px-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Book Language Medium
                  </legend>
                  <div className="mt-1 flex flex-col gap-1 text-sm text-slate-700">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="medium"
                        value="English Medium"
                        checked={formData.medium === 'English Medium'}
                        onChange={updateField}
                      />
                      English Medium
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="medium"
                        value="Punjabi Medium"
                        checked={formData.medium === 'Punjabi Medium'}
                        onChange={updateField}
                      />
                      Punjabi Medium
                    </label>
                  </div>
                </fieldset>
                </div>

                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Flat / House No. / Building Name
                <input
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={updateField}
                  required
                  className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                />
              </label>

                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Area / Street / Locality
                <input
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={updateField}
                  required
                  className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                />
              </label>

                <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Landmark (optional)
                  <input
                    name="landmark"
                    value={formData.landmark}
                    onChange={updateField}
                    className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  District
                  <input
                    name="district"
                    value={formData.district}
                    onChange={updateField}
                    required
                    className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                  />
                </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  City / Town
                  <input
                    name="city"
                    value={formData.city}
                    onChange={updateField}
                    required
                    className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  State
                  <input
                    name="state"
                    value={formData.state}
                    onChange={updateField}
                    required
                    className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  PIN Code
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={updateField}
                    required
                    pattern="[0-9]{6}"
                    className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                  />
                </label>
                </div>

                <label className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Country
                <input
                  name="country"
                  value={formData.country}
                  onChange={updateField}
                  required
                  className="mt-1 w-full rounded-md border border-[#dac6c7] bg-slate-50 px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring"
                />
              </label>

                {error ? (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #9b1e22 0%, #7b181b 50%, #5a1013 100%)',
                    boxShadow: '0 8px 24px -4px rgba(123,24,27,0.45), 0 0 0 1px rgba(123,24,27,0.2)',
                  }}
                >
                  {loading ? 'Initializing Payment...' : `Proceed to Razorpay (${formattedPrice})`}
                </button>
              </form>

              <div className="mt-5 text-center text-xs leading-5 text-slate-500 lg:hidden">
                Need help? Call{' '}
                <a href={`tel:${supportPhone.replace(/\s+/g, '')}`} className="font-semibold text-[var(--maroon)] hover:underline">
                  {supportPhone}
                </a>{' '}
                or email{' '}
                <a href={`mailto:${supportEmail}`} className="font-semibold text-[var(--maroon)] hover:underline">
                  {supportEmail}
                </a>
                .
              </div>
            </div>
          </article>

          <aside className="order-first hidden space-y-5 lg:order-last lg:block lg:sticky lg:top-24 lg:self-start">
            <article
              className="overflow-hidden rounded-[2rem] border border-[#cbdde8] bg-white p-6 shadow-[0_18px_50px_-26px_rgba(15,91,130,0.38)]"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f7fbfe 100%)',
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f5b82]">
                <BookOpen className="h-3.5 w-3.5" />
                Buy Now
              </div>
              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">from</p>
                  <p className="title-font text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {formattedPrice}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#dcecf4] bg-[#f7fbfe] px-3 py-2 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Secure payment
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Razorpay checkout</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 rounded-[1.5rem] border border-[#dcecf4] bg-[#fafdff] p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-4">
                  <span>Book</span>
                  <span className="font-semibold text-slate-900">{selectedBook.title}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Author</span>
                  <span className="font-semibold text-slate-900">{selectedBook.author}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Language</span>
                  <span className="font-semibold text-slate-900">
                    {getLanguageBadges(selectedBook)[0] || 'Standard edition'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">India Post</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-[#dcecf4] pt-3">
                  <span className="font-medium text-slate-500">Gateway amount</span>
                  <span className="font-semibold text-[#0f5b82]">{formattedPrice}</span>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[#ebdfe0] bg-[#fffaf0] p-4">
                <p className="flex items-start gap-2 text-sm font-semibold text-[var(--maroon)]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  After payment confirmation, a confirmation email and shipment tracker ID
                  will be sent to your registered email.
                </p>
                <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-[var(--maroon)]">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  Strict policy: All purchases are non-refundable once payment is
                  successful.
                </p>
              </div>
            </article>

            <article className="rounded-[2rem] border border-[#e8dfe0] bg-white p-6 shadow-[0_16px_45px_-30px_rgba(123,24,27,0.3)]">
              <p className="text-sm font-semibold text-[var(--maroon)]">
                If you do not receive the confirmation email, call{' '}
                <a href={`tel:${supportPhone.replace(/\s+/g, '')}`} className="font-semibold text-[var(--maroon)] hover:underline">
                  {supportPhone}
                </a>{' '}
                or email{' '}
                <a href={`mailto:${supportEmail}`} className="font-semibold text-[var(--maroon)] hover:underline">
                  {supportEmail}
                </a>
                .
              </p>
            </article>
          </aside>
        </div>
      </section>
    </SiteShell>
  )
}

export default CheckoutPage
