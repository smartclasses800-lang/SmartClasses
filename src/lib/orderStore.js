const ORDERS_KEY = 'illam_orders'
const PENDING_ORDER_KEY = 'illam_pending_order'

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function getOrders() {
  const raw = localStorage.getItem(ORDERS_KEY)
  const parsed = safeJsonParse(raw, [])
  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.sort((a, b) => {
    const aTime = new Date(a.paidAt || a.createdAt || 0).getTime()
    const bTime = new Date(b.paidAt || b.createdAt || 0).getTime()
    return bTime - aTime
  })
}

function setOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function upsertOrder(order) {
  const orders = getOrders()
  const index = orders.findIndex((item) => item.orderId === order.orderId)

  if (index === -1) {
    orders.push(order)
  } else {
    orders[index] = { ...orders[index], ...order }
  }

  setOrders(orders)
}

export function updateOrder(orderId, updater) {
  const orders = getOrders()
  const index = orders.findIndex((item) => item.orderId === orderId)
  if (index === -1) {
    return null
  }

  const nextOrder = updater(orders[index])
  orders[index] = nextOrder
  setOrders(orders)
  return nextOrder
}

export function savePendingOrder(pendingOrder) {
  localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pendingOrder))
}

export function consumePendingOrder(orderId) {
  const raw = localStorage.getItem(PENDING_ORDER_KEY)
  const pending = safeJsonParse(raw, null)

  if (!pending || pending.orderId !== orderId) {
    return null
  }

  localStorage.removeItem(PENDING_ORDER_KEY)
  return pending
}
