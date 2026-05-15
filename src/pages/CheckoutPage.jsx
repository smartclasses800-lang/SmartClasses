import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SiteShell from '../components/SiteShell'
import { savePendingOrder } from '../lib/orderStore'
import { loadRazorpayScript } from '../lib/razorpay'

const supportPhone = import.meta.env.VITE_SUPPORT_PHONE || '+91 85588 00797'
const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'illamerpunjab@gmail.com'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

const STORAGE_KEY = 'checkoutFormData'

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

function CheckoutPage() {
  const navigate = useNavigate()
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
        const resp = await fetch(`${apiBaseUrl}/products/illam-e-punjab-book`)
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
  }, [])

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
          sku: 'illam-e-punjab-book',
          title: 'ILLAM-E-PUNJAB',
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
        name: 'ILLAM-E-PUNJAB',
        description: 'Punjab History Book Purchase',
        order_id: order.orderId,
        image: '/book.webp',
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
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
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-[#ead7d7] bg-white/95 p-6 shadow-[0_22px_60px_-28px_rgba(123,24,27,0.28)] backdrop-blur sm:p-8">
            <h1 className="title-font text-3xl font-bold text-[var(--maroon)] sm:text-4xl">
              Checkout Details
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
              Fill your details exactly as required for India Post shipping. After
              successful payment, we will send your confirmation email and tracking ID.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
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

              <div className="grid gap-5 sm:grid-cols-2">
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

              <div className="grid gap-5 sm:grid-cols-2">
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

              <div className="grid gap-5 sm:grid-cols-3">
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
                className="inline-flex w-full items-center justify-center rounded-xl px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #9b1e22 0%, #7b181b 50%, #5a1013 100%)',
                  boxShadow: '0 8px 24px -4px rgba(123,24,27,0.45), 0 0 0 1px rgba(123,24,27,0.2)',
                }}
              >
                {loading ? 'Initializing Payment...' : `Proceed to Razorpay (${formattedPrice})`}
              </button>
            </form>
          </article>

          <aside className="order-first space-y-5 lg:order-last lg:sticky lg:top-24 lg:self-start">
            <article
              className="rounded-2xl p-6 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #fffdf7 0%, #fef8ec 100%)',
                border: '1.5px solid #f0d898',
              }}
            >
              <h2 className="title-font text-2xl font-bold text-[var(--maroon)]">
                Order Summary
              </h2>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p className="flex items-center justify-between">
                  <span>Book</span>
                  <span className="font-semibold">ILLAM-E-PUNJAB</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Price</span>
                  <span className="font-semibold">{formattedPrice}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">India Post</span>
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-[#ebdfe0] bg-[#fffaf0] p-6 shadow-sm">
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
              <p className="mt-4 text-sm text-slate-700">
                If you do not receive confirmation email, call{' '}
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
