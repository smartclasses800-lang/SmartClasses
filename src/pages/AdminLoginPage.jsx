import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail } from 'lucide-react'
import { isAdminAuthenticated, loginAdmin } from '../lib/adminAuth'

function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    loginAdmin(email.trim(), secretKey.trim())
      .then(() => navigate('/admin', { replace: true }))
      .catch((loginError) => setError(loginError.message || 'Invalid admin credentials.'))
  }

  return (
    <div className="min-h-screen bg-[var(--muted-bg)] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="title-font text-4xl font-bold text-[var(--maroon)]">
            Admin Login
          </h1>
          <p className="mt-2 text-slate-700">
            Manage paid orders, tracker IDs, and dispatch updates.
          </p>
        </div>

        <article className="mx-auto max-w-md rounded-2xl border border-[#ead9da] bg-white p-6 shadow-sm sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <div className="mt-1 flex items-center rounded-md border border-[#dac6c7] px-3 py-2">
                <Mail className="mr-2 h-4 w-4 text-slate-500" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full outline-none"
                  type="email"
                  placeholder="johnkhore26@gmail.com"
                  required
                />
              </div>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Secret Key
              <div className="mt-1 flex items-center rounded-md border border-[#dac6c7] px-3 py-2">
                <LockKeyhole className="mr-2 h-4 w-4 text-slate-500" />
                <input
                  value={secretKey}
                  onChange={(event) => setSecretKey(event.target.value)}
                  className="w-full outline-none"
                  type="password"
                  placeholder="Enter secret key"
                  required
                />
              </div>
            </label>

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-[var(--maroon)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--maroon-hover)]"
            >
              Login to Dashboard
            </button>
          </form>
        </article>
      </div>
    </div>
  )
}

export default AdminLoginPage
