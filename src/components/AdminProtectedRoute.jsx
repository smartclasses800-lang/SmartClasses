import { Navigate } from 'react-router-dom'
import { isAdminAuthenticated } from '../lib/adminAuth'

function AdminProtectedRoute({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminProtectedRoute
