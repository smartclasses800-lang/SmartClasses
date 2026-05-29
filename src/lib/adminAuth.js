const ADMIN_SESSION_KEY = 'illam_admin_session'
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')

export async function loginAdmin(email, password) {
  const response = await fetch(`${apiBaseUrl}/auth/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.message || 'Invalid admin credentials.')
  }

  const data = await response.json()

  sessionStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({
      token: data.token,
      admin: data.admin,
      loggedInAt: new Date().toISOString(),
    }),
  )

  return data
}

export function isAdminAuthenticated() {
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY)
  if (!session) {
    return false
  }

  try {
    const parsed = JSON.parse(session)
    return Boolean(parsed.token)
  } catch {
    return false
  }
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

export function getAdminSession() {
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY)
  if (!session) {
    return null
  }

  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

export function getAdminToken() {
  const session = getAdminSession()
  return session?.token || ''
}
