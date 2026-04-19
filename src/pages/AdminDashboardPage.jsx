import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, PackageCheck, RefreshCw, Send } from 'lucide-react'
import { getAdminSession, getAdminToken, logoutAdmin } from '../lib/adminAuth'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function formatDateTime(value) {
  if (!value) {
    return 'N/A'
  }

  return new Date(value).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [trackerDrafts, setTrackerDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState('')
  const [error, setError] = useState('')

  const session = getAdminSession()
  const token = getAdminToken()

  const loadOrders = async () => {
    setLoading(true)
    setError('')

    try {
      // Hardcoded mock data for demonstration
      const mockOrders = [
        {
          razorpayOrderId: 'ORD001',
          status: 'paid',
          customer: {
            fullName: 'Rajesh Kumar',
            email: 'rajesh.kumar@example.com',
            phone: '+91 98765 43210',
            medium: 'Online',
          },
          payment: {
            razorpayPaymentId: 'PAY_001',
            verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          amount: 49999,
          shippingAddress: {
            addressLine1: '123 Punjabi Street',
            addressLine2: 'Near Gurudwara',
            landmark: 'Opposite School',
            city: 'Amritsar',
            district: 'Amritsar',
            state: 'Punjab',
            pincode: '143001',
            country: 'India',
          },
          trackerId: '',
          dispatchedAt: null,
        },
        {
          razorpayOrderId: 'ORD002',
          status: 'paid',
          customer: {
            fullName: 'Priya Singh',
            email: 'priya.singh@example.com',
            phone: '+91 97654 32109',
            medium: 'Online',
          },
          payment: {
            razorpayPaymentId: 'PAY_002',
            verifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
          paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          amount: 79999,
          shippingAddress: {
            addressLine1: '456 Golden Temple Road',
            addressLine2: 'Apartment 5B',
            landmark: 'Near Hotel Punjab',
            city: 'Ludhiana',
            district: 'Ludhiana',
            state: 'Punjab',
            pincode: '141001',
            country: 'India',
          },
          trackerId: '',
          dispatchedAt: null,
        },
        {
          razorpayOrderId: 'ORD003',
          status: 'out_for_delivery',
          customer: {
            fullName: 'Harpreet Kaur',
            email: 'harpreet.kaur@example.com',
            phone: '+91 96543 21098',
            medium: 'Online',
          },
          payment: {
            razorpayPaymentId: 'PAY_003',
            verifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          amount: 59999,
          shippingAddress: {
            addressLine1: '789 Chandigarh Road',
            addressLine2: 'House No. 42',
            landmark: 'Near Market',
            city: 'Jalandhar',
            district: 'Jalandhar',
            state: 'Punjab',
            pincode: '144001',
            country: 'India',
          },
          trackerId: 'EA123456789IN',
          dispatchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          razorpayOrderId: 'ORD004',
          status: 'delivered',
          customer: {
            fullName: 'Simran Sharma',
            email: 'simran.sharma@example.com',
            phone: '+91 95432 10987',
            medium: 'Online',
          },
          payment: {
            razorpayPaymentId: 'PAY_004',
            verifiedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          },
          paidAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          amount: 69999,
          shippingAddress: {
            addressLine1: '321 Mall Road',
            addressLine2: 'Flat 10',
            landmark: 'Opposite Cinema',
            city: 'Patiala',
            district: 'Patiala',
            state: 'Punjab',
            pincode: '147001',
            country: 'India',
          },
          trackerId: 'EA987654321IN',
          dispatchedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
        {
          razorpayOrderId: 'ORD005',
          status: 'paid',
          customer: {
            fullName: 'Akshay Verma',
            email: 'akshay.verma@example.com',
            phone: '+91 94321 09876',
            medium: 'Online',
          },
          payment: {
            razorpayPaymentId: 'PAY_005',
            verifiedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
          paidAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          amount: 89999,
          shippingAddress: {
            addressLine1: '654 Leisure Valley',
            addressLine2: 'Tower A',
            landmark: 'Near IT Park',
            city: 'Mohali',
            district: 'Mohali',
            state: 'Punjab',
            pincode: '160062',
            country: 'India',
          },
          trackerId: '',
          dispatchedAt: null,
        },
      ]

      setOrders(mockOrders)
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

  const paidOrders = useMemo(
    () => orders.filter((order) => order.status === 'paid'),
    [orders],
  )

  const dispatchedOrders = useMemo(
    () => orders.filter((order) => order.status === 'out_for_delivery' || order.status === 'delivered'),
    [orders],
  )

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === 'pending_payment'),
    [orders],
  )

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

    try {
      await updateOrderStatus(order.razorpayOrderId, { trackerId, status: 'out_for_delivery' })
    } catch (updateError) {
      setError(updateError.message || 'Unable to send tracker email.')
    }
  }

  const handleMarkDelivered = async (order) => {
    const trackerId = (trackerDrafts[order.razorpayOrderId] || order.trackerId || '').trim()

    if (!trackerId) {
      setError('Please enter tracker ID before marking delivered.')
      return
    }

    try {
      await updateOrderStatus(order.razorpayOrderId, { trackerId, status: 'delivered' })
    } catch (updateError) {
      setError(updateError.message || 'Unable to mark order delivered.')
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--muted-bg)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-[#ebdcdc] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                ILLAM-E-PUNJAB Admin
              </p>
              <h1 className="title-font mt-1 text-3xl font-bold text-[var(--maroon)]">
                Orders Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-700">
                Logged in as {session?.admin?.email || 'Admin'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadOrders}
                className="inline-flex items-center gap-2 rounded-md border border-[#e0cfcf] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
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

        <section className="mb-6 grid gap-4 sm:grid-cols-4">
          <article className="rounded-xl border border-[#eadcdc] bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Total Orders</p>
            <p className="mt-2 text-3xl font-bold text-[var(--maroon)]">{orders.length}</p>
          </article>
          <article className="rounded-xl border border-[#eadcdc] bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Pending Payments</p>
            <p className="mt-2 text-3xl font-bold text-[var(--maroon)]">{pendingOrders.length}</p>
          </article>
          <article className="rounded-xl border border-[#eadcdc] bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Paid Orders</p>
            <p className="mt-2 text-3xl font-bold text-[var(--maroon)]">{paidOrders.length}</p>
          </article>
          <article className="rounded-xl border border-[#eadcdc] bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Sent / Delivered</p>
            <p className="mt-2 text-3xl font-bold text-[var(--maroon)]">{dispatchedOrders.length}</p>
          </article>
        </section>

        <section className="mb-8 rounded-2xl border border-[#ebdddd] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="title-font text-2xl font-bold text-[var(--maroon)]">
            Paid Orders (Action Required)
          </h2>

          {loading ? (
            <p className="mt-4 text-sm text-slate-600">Loading orders...</p>
          ) : paidOrders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No paid orders pending dispatch.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {paidOrders.map((order) => (
                <article key={order.razorpayOrderId} className="rounded-lg border border-[#ecdede] p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                    <div className="space-y-1 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">{order.customer.fullName}</p>
                      <p>{order.customer.email} | {order.customer.phone}</p>
                      <p>Order: {order.razorpayOrderId}</p>
                      <p>Payment: {order.payment?.razorpayPaymentId || 'N/A'}</p>
                      <p>Amount: Rs. {(Number(order.amount || 0) / 100).toFixed(0)}</p>
                      <p>Paid At: {formatDateTime(order.payment?.verifiedAt || order.paidAt)}</p>
                      <p>Medium: {order.customer.medium}</p>
                    </div>

                    <div className="text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Shipping Address</p>
                      <p className="mt-1">{order.shippingAddress.addressLine1}</p>
                      <p>{order.shippingAddress.addressLine2}</p>
                      <p>{order.shippingAddress.landmark || 'No landmark'}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.district}
                      </p>
                      <p>
                        {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>

                    <div className="flex min-w-[220px] flex-col gap-2">
                      <input
                        value={trackerDrafts[order.razorpayOrderId] ?? order.trackerId ?? ''}
                        onChange={(event) =>
                          handleTrackerDraft(order.razorpayOrderId, event.target.value)
                        }
                        className="rounded-md border border-[#dac6c7] px-3 py-2 text-sm outline-none ring-[var(--maroon)]/25 focus:ring"
                        placeholder="Enter India Post tracker ID"
                      />
                      <button
                        onClick={() => handleSendTrackerEmail(order)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d9c6c7] px-3 py-2 text-sm font-semibold text-[var(--maroon)] hover:bg-[#faf3f3]"
                      >
                        <Send className="h-4 w-4" /> Send Tracker Email
                      </button>
                      <button
                        onClick={() => handleMarkDelivered(order)}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--maroon)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[var(--maroon-hover)]"
                      >
                        <PackageCheck className="h-4 w-4" /> Mark Delivered
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#ebdddd] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="title-font text-2xl font-bold text-[var(--maroon)]">
            Sent For Delivery / Delivered
          </h2>

          {dispatchedOrders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No dispatched orders yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {dispatchedOrders.map((order) => (
                <article key={order.razorpayOrderId} className="rounded-lg border border-[#ecdfdf] bg-[#fffdf9] p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{order.customer.fullName}</p>
                  <p className="mt-1">Order ID: {order.razorpayOrderId}</p>
                  <p>Status: {order.status}</p>
                  <p>Tracker ID: {order.trackerId || 'N/A'}</p>
                  <p>Marked At: {formatDateTime(order.dispatchedAt)}</p>
                  <p>Email: {order.customer.email}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminDashboardPage
