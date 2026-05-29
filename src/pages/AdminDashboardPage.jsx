import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  CreditCard,
  ExternalLink,
  BookOpen,
  Loader2,
  LogOut,
  PackageCheck,
  Pencil,
  RefreshCw,
  Send,
  X,
  Truck,
} from 'lucide-react'
import { getAdminSession, getAdminToken, logoutAdmin } from '../lib/adminAuth'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')

const TABS = [
  { key: 'all', label: 'All Orders', icon: ClipboardList },
  { key: 'pending', label: 'Pending Payments', icon: CreditCard },
  { key: 'paid', label: 'Paid Orders', icon: AlertCircle },
  { key: 'dispatched', label: 'Sent / Delivered', icon: Truck },
]

function formatDateTime(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusBadge({ status }) {
  const map = {
    pending_payment: { text: 'Pending Payment', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    paid: { text: 'Paid', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    out_for_delivery: { text: 'Out for Delivery', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    delivered: { text: 'Delivered', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    failed: { text: 'Failed', color: 'bg-red-50 text-red-700 border-red-200' },
  }
  const s = map[status] || { text: status, color: 'bg-slate-50 text-slate-700 border-slate-200' }
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.color}`}>
      {s.text}
    </span>
  )
}

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [trackerDrafts, setTrackerDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('paid')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sendingTracker, setSendingTracker] = useState({})
  const [markingDelivered, setMarkingDelivered] = useState({})
  const [resendingTracker, setResendingTracker] = useState({})

  const session = getAdminSession()
  const token = getAdminToken()

  const loadOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${apiBaseUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        const errBody = await response.json().catch(() => null)
        throw new Error(errBody?.message || 'Unable to load orders')
      }
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (loadError) {
      setError(loadError.message || 'Unable to load admin orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true })
      return
    }
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate])

  const allOrders = useMemo(() => orders, [orders])
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending_payment'), [orders])
  const paidOrders = useMemo(() => orders.filter((o) => o.status === 'paid'), [orders])
  const dispatchedOrders = useMemo(
    () => orders.filter((o) => o.status === 'out_for_delivery' || o.status === 'delivered'),
    [orders],
  )

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return allOrders
    if (activeTab === 'pending') return pendingOrders
    if (activeTab === 'paid') return paidOrders
    if (activeTab === 'dispatched') return dispatchedOrders
    return allOrders
  }, [activeTab, allOrders, pendingOrders, paidOrders, dispatchedOrders])

  const handleTrackerDraft = (orderId, value) => {
    setTrackerDrafts((prev) => ({ ...prev, [orderId]: value }))
  }

  const updateOrderStatus = async (orderId, payload) => {
    const response = await fetch(`${apiBaseUrl}/orders/${orderId}/tracker`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw new Error(errorBody?.message || 'Unable to update order.')
    }
    const data = await response.json()
    setActionMessage(data.message || 'Order updated successfully.')
    await loadOrders()
  }

  const handleSendTrackerEmail = async (order) => {
    const trackerId = (trackerDrafts[order.razorpayOrderId] || order.trackerId || '').trim()
    if (!trackerId) {
      setError('Please enter tracker ID before sending email.')
      return
    }
    setSendingTracker((prev) => ({ ...prev, [order.razorpayOrderId]: true }))
    try {
      await updateOrderStatus(order.razorpayOrderId, { trackerId, status: 'out_for_delivery' })
    } catch (updateError) {
      setError(updateError.message || 'Unable to send tracker email.')
    } finally {
      setSendingTracker((prev) => ({ ...prev, [order.razorpayOrderId]: false }))
    }
  }

  const handleMarkDelivered = async (order) => {
    const trackerId = (trackerDrafts[order.razorpayOrderId] || order.trackerId || '').trim()
    if (!trackerId) {
      setError('Please enter tracker ID before marking delivered.')
      return
    }
    setMarkingDelivered((prev) => ({ ...prev, [order.razorpayOrderId]: true }))
    try {
      await updateOrderStatus(order.razorpayOrderId, { trackerId, status: 'delivered' })
    } catch (updateError) {
      setError(updateError.message || 'Unable to mark order delivered.')
    } finally {
      setMarkingDelivered((prev) => ({ ...prev, [order.razorpayOrderId]: false }))
    }
  }

  const handleResendTracker = async (order) => {
    const trackerId = (trackerDrafts[order.razorpayOrderId] || order.trackerId || '').trim()
    if (!trackerId) {
      setError('Please enter tracker ID before resending.')
      return
    }
    setResendingTracker((prev) => ({ ...prev, [order.razorpayOrderId]: true }))
    try {
      await updateOrderStatus(order.razorpayOrderId, { trackerId, status: 'out_for_delivery' })
    } catch (updateError) {
      setError(updateError.message || 'Unable to resend tracker email.')
    } finally {
      setResendingTracker((prev) => ({ ...prev, [order.razorpayOrderId]: false }))
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  const statCards = [
    { key: 'all', label: 'Total Orders', count: allOrders.length, color: 'text-[var(--maroon)]' },
    { key: 'pending', label: 'Pending Payments', count: pendingOrders.length, color: 'text-amber-600' },
    { key: 'paid', label: 'Paid Orders', count: paidOrders.length, color: 'text-emerald-600' },
    { key: 'dispatched', label: 'Sent / Delivered', count: dispatchedOrders.length, color: 'text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-[var(--muted-bg)] px-4 py-8 sm:px-6 lg:px-8">
      <div
        className={`fixed inset-0 z-50 sm:hidden transition-opacity duration-300 ${
          drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          aria-label="Close admin drawer"
          className="absolute inset-0 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-80 max-w-[85vw] transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-start justify-between border-b border-[#ebdcdc] px-4 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                ILLAM-E-PUNJAB
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--maroon)]">
                {session?.admin?.email || 'Admin'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close admin drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-1 p-3">
            <button
              type="button"
              onClick={() => {
                loadOrders()
                setDrawerOpen(false)
              }}
              disabled={loading}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
              <RefreshCw className="h-4 w-4" /> Refresh Orders
            </button>
            <Link
              to="/admin/books"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <BookOpen className="h-4 w-4" /> Show Books
            </Link>
            <Link
              to="/"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ExternalLink className="h-4 w-4" /> View Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-[#ebdcdc] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                ILLAM-E-PUNJAB Admin
              </p>
              <h1 className="title-font mt-1 text-2xl font-bold text-[var(--maroon)] sm:text-3xl">
                Orders Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-700">
                Logged in as {session?.admin?.email || 'Admin'}
              </p>
            </div>
            <div className="hidden flex-wrap gap-3 sm:flex">
              <button
                onClick={loadOrders}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md border border-[#e0cfcf] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
              <Link
                to="/admin/books"
                className="inline-flex items-center gap-2 rounded-md border border-[#e0cfcf] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <BookOpen className="h-4 w-4" /> Show Books
              </Link>
              <Link
                to="/"
                className="rounded-md border border-[#e0cfcf] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Store
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--maroon)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--maroon-hover)]"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="rounded-md border border-[#e0cfcf] p-2 text-slate-700 sm:hidden"
              aria-label="Open admin drawer"
            >
              <span className="block text-xl leading-none">☰</span>
            </button>
          </div>
        </header>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {actionMessage ? (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {actionMessage}
          </div>
        ) : null}

        <section className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map((card) => (
            <button
              key={card.key}
              onClick={() => setActiveTab(card.key)}
              className={`rounded-xl border p-3 text-left shadow-sm transition sm:p-4 ${
                activeTab === card.key
                  ? 'border-[var(--maroon)] bg-[#fff5f5] ring-1 ring-[var(--maroon)]'
                  : 'border-[#eadcdc] bg-white hover:bg-slate-50'
              }`}
            >
              <p className="text-sm text-slate-600">{card.label}</p>
              <p className={`mt-2 text-2xl font-bold sm:text-3xl ${card.color}`}>{card.count}</p>
            </button>
          ))}
        </section>

        <div className="mb-6 -mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? 'border-[var(--maroon)] bg-[var(--maroon)] text-white'
                      : 'border-[#e0cfcf] bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <section className="rounded-2xl border border-[#ebdddd] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="title-font text-xl font-bold text-[var(--maroon)] sm:text-2xl">
            {TABS.find((t) => t.key === activeTab)?.label}
          </h2>

          {loading ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--maroon)]" />
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No orders found in this category.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {filteredOrders.map((order) => {
                const isSending = sendingTracker[order.razorpayOrderId]
                const isMarking = markingDelivered[order.razorpayOrderId]
                const isResending = resendingTracker[order.razorpayOrderId]
                const anyActionLoading = isSending || isMarking || isResending
                return (
                  <article
                    key={order.razorpayOrderId}
                    className={`rounded-lg border p-4 transition ${anyActionLoading ? 'opacity-70' : 'opacity-100'} ${
                      order.status === 'paid'
                        ? 'border-[#ecdede] bg-white'
                        : order.status === 'out_for_delivery'
                        ? 'border-blue-200 bg-blue-50/40'
                        : order.status === 'delivered'
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-[#ecdede] bg-white'
                    }`}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        <span className="text-xs text-slate-500">Order: {order.razorpayOrderId}</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDateTime(order.payment?.verifiedAt || order.paidAt || order.createdAt)}
                      </span>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1fr_1fr_auto]">
                      <div className="space-y-1 text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">{order.customer.fullName}</p>
                        <p>{order.customer.email} | {order.customer.phone}</p>
                        <p>
                          Book: <span className="font-semibold text-slate-900">{order.product?.title || 'N/A'}</span>
                        </p>
                        <p>
                          SKU: <span className="font-mono text-slate-900">{order.product?.sku || 'N/A'}</span>
                        </p>
                        <p>Payment ID: {order.payment?.razorpayPaymentId || 'N/A'}</p>
                        <p>Amount: Rs. {(Number(order.amount || 0) / 100).toFixed(0)}</p>
                        <p>Medium: {order.customer.medium}</p>
                        {order.trackerId ? (
                          <p className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">Tracker:</span>
                            <span className="font-mono font-bold text-[var(--maroon)]">{order.trackerId}</span>
                            <a
                              href="https://www.indiapost.gov.in/"
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" /> Track
                            </a>
                          </p>
                        ) : null}
                      </div>

                      <div className="text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">Shipping Address</p>
                        <p className="mt-1">{order.shippingAddress.addressLine1}</p>
                        <p>{order.shippingAddress.addressLine2}</p>
                        {order.shippingAddress.landmark ? <p>{order.shippingAddress.landmark}</p> : null}
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.district}
                        </p>
                        <p>
                          {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>

                      {order.status === 'paid' ? (
                        <div className="flex w-full flex-col gap-2 border-t border-[#ecdede] pt-4 xl:min-w-[220px] xl:w-auto xl:border-t-0 xl:pt-0">
                          <input
                            value={trackerDrafts[order.razorpayOrderId] ?? order.trackerId ?? ''}
                            onChange={(event) =>
                              handleTrackerDraft(order.razorpayOrderId, event.target.value)
                            }
                            disabled={anyActionLoading}
                            className="w-full rounded-md border border-[#dac6c7] px-3 py-2 text-sm outline-none ring-[var(--maroon)]/25 transition focus:ring disabled:opacity-60"
                            placeholder="Enter India Post tracker ID"
                          />
                          <button
                            onClick={() => handleSendTrackerEmail(order)}
                            disabled={isSending || isMarking}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#d9c6c7] px-3 py-2 text-sm font-semibold text-[var(--maroon)] transition hover:bg-[#faf3f3] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                            {isSending ? 'Sending...' : 'Send Tracker Email'}
                          </button>
                          <button
                            onClick={() => handleMarkDelivered(order)}
                            disabled={isSending || isMarking}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--maroon)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[var(--maroon-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isMarking ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <PackageCheck className="h-4 w-4" />
                            )}
                            {isMarking ? 'Marking...' : 'Mark Delivered'}
                          </button>
                        </div>
                      ) : order.status === 'out_for_delivery' ? (
                        <div className="flex w-full flex-col gap-2 border-t border-[#ecdede] pt-4 xl:min-w-[220px] xl:w-auto xl:border-t-0 xl:pt-0">
                          <input
                            value={trackerDrafts[order.razorpayOrderId] ?? order.trackerId ?? ''}
                            onChange={(event) =>
                              handleTrackerDraft(order.razorpayOrderId, event.target.value)
                            }
                            disabled={anyActionLoading}
                            className="w-full rounded-md border border-[#dac6c7] px-3 py-2 text-sm outline-none ring-[var(--maroon)]/25 transition focus:ring disabled:opacity-60"
                            placeholder="Edit tracker ID if needed"
                          />
                          <button
                            onClick={() => handleResendTracker(order)}
                            disabled={isResending || isMarking}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#d9c6c7] px-3 py-2 text-xs font-semibold text-[var(--maroon)] transition hover:bg-[#faf3f3] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isResending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Pencil className="h-3 w-3" />
                            )}
                            {isResending ? 'Resending...' : 'Update & Resend Tracker'}
                          </button>
                          <button
                            onClick={() => handleMarkDelivered(order)}
                            disabled={isResending || isMarking}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--maroon)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[var(--maroon-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isMarking ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            {isMarking ? 'Marking...' : 'Mark Delivered'}
                          </button>
                          <p className="text-xs text-slate-500">
                            Dispatched: {formatDateTime(order.dispatchedAt)}
                          </p>
                        </div>
                      ) : order.status === 'delivered' ? (
                        <div className="flex w-full flex-col gap-2 border-t border-[#ecdede] pt-4 xl:min-w-[220px] xl:w-auto xl:border-t-0 xl:pt-0">
                          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                            <p className="flex items-center gap-1 font-semibold">
                              <CheckCircle className="h-4 w-4" /> Delivered
                            </p>
                            {order.dispatchedAt ? (
                              <p className="mt-1 text-xs">
                                Dispatched: {formatDateTime(order.dispatchedAt)}
                              </p>
                            ) : null}
                          </div>
                          <input
                            value={trackerDrafts[order.razorpayOrderId] ?? order.trackerId ?? ''}
                            onChange={(event) =>
                              handleTrackerDraft(order.razorpayOrderId, event.target.value)
                            }
                            disabled={anyActionLoading}
                            className="w-full rounded-md border border-[#dac6c7] px-3 py-2 text-sm outline-none ring-[var(--maroon)]/25 transition focus:ring disabled:opacity-60"
                            placeholder="Edit tracker ID if needed"
                          />
                          <button
                            onClick={() => handleResendTracker(order)}
                            disabled={isResending}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#d9c6c7] px-3 py-2 text-xs font-semibold text-[var(--maroon)] transition hover:bg-[#faf3f3] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isResending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Pencil className="h-3 w-3" />
                            )}
                            {isResending ? 'Resending...' : 'Update & Resend Tracker'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminDashboardPage
