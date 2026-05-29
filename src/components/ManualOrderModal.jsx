import { useEffect, useMemo, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { createManualOrder } from '../lib/booksApi'

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  medium: 'Punjabi Medium',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  district: '',
  city: '',
  state: 'Punjab',
  pincode: '',
  country: 'India',
  sku: '',
  quantity: 1,
  notes: '',
}

function ManualOrderModal({ open, onClose, onOrderCreated, books, token }) {
  const [formData, setFormData] = useState(initialFormState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const selectedBook = useMemo(
    () => books.find((book) => book.sku === formData.sku) || books[0] || null,
    [books, formData.sku],
  )

  useEffect(() => {
    if (!open) {
      return
    }

    setError('')
    setSuccess('')
    setFormData((prev) => ({
      ...initialFormState,
      sku: prev.sku || books[0]?.sku || '',
    }))
  }, [books, open])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const payload = {
        customer: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          medium: formData.medium,
        },
        shippingAddress: {
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.addressLine2.trim(),
          landmark: formData.landmark.trim(),
          district: formData.district.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          country: formData.country.trim(),
        },
        product: {
          sku: formData.sku,
          title: selectedBook?.title || '',
          quantity: Number(formData.quantity || 1),
        },
        notes: formData.notes.trim(),
      }

      const response = await createManualOrder(token, payload)
      setSuccess(response?.message || 'Manual order created successfully.')

      window.setTimeout(() => {
        onOrderCreated?.()
        onClose?.()
      }, 700)
    } catch (submitError) {
      setError(submitError.message || 'Unable to create manual order.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <button
        type="button"
        aria-label="Close manual order modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-[#ebdcdc] bg-[var(--muted-bg)] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#ebdcdc] bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">ILLAM-E-PUNJAB</p>
            <h2 className="title-font mt-1 text-2xl font-bold text-[var(--maroon)]">Create Manual Order</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close manual order modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#ebdcdc] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--maroon)]">Customer Details</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Full Name
                  <input name="fullName" value={formData.fullName} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                  <input name="email" type="email" value={formData.email} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Phone
                  <input name="phone" type="tel" value={formData.phone} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Medium
                  <select name="medium" value={formData.medium} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring">
                    <option value="Punjabi Medium">Punjabi Medium</option>
                    <option value="English Medium">English Medium</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#ebdcdc] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--maroon)]">Shipping Address</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                  Address Line 1
                  <input name="addressLine1" value={formData.addressLine1} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                  Address Line 2
                  <input name="addressLine2" value={formData.addressLine2} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Landmark
                  <input name="landmark" value={formData.landmark} onChange={updateField} className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  District
                  <input name="district" value={formData.district} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  City
                  <input name="city" value={formData.city} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  State
                  <input name="state" value={formData.state} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Pincode
                  <input name="pincode" value={formData.pincode} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Country
                  <input name="country" value={formData.country} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#ebdcdc] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--maroon)]">Order Details</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                  Book
                  <select name="sku" value={formData.sku} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring">
                    <option value="" disabled>
                      Select a book
                    </option>
                    {books.map((book) => (
                      <option key={book.sku} value={book.sku}>
                        {book.title} — ₹{Math.round(Number(book.pricePaise || 0) / 100)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Quantity
                  <input name="quantity" type="number" min="1" value={formData.quantity} onChange={updateField} required className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" />
                </label>
                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                  Admin Notes
                  <textarea name="notes" value={formData.notes} onChange={updateField} rows={4} className="mt-1 w-full rounded-md border border-[#dac6c7] px-3 py-2 outline-none ring-[var(--maroon)]/25 transition focus:ring" placeholder="Paid via PhonePe, ref: XYZ" />
                </label>
              </div>
            </section>

            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
            {success ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
          </div>

          <div className="sticky bottom-0 mt-5 border-t border-[#ebdcdc] bg-[var(--muted-bg)] pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--maroon)] px-6 py-4 text-base font-bold text-white transition hover:bg-[var(--maroon-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {loading ? 'Creating...' : 'Create Manual Order (Mark as Paid)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ManualOrderModal