import { Navigate, Route, Routes } from 'react-router-dom'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminBooksPage from './pages/AdminBooksPage'
import AdminLoginPage from './pages/AdminLoginPage'
import CancellationRefundPage from './pages/CancellationRefundPage'
import CheckoutPage from './pages/CheckoutPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import ShippingPolicyPage from './pages/ShippingPolicyPage'
import TermsPage from './pages/TermsPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
      <Route
        path="/cancellation-refund-policy"
        element={<CancellationRefundPage />}
      />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/books"
        element={
          <AdminProtectedRoute>
            <AdminBooksPage />
          </AdminProtectedRoute>
        }
      />
      <Route path="/terms-and-conditions" element={<TermsPage />} />
      <Route path="/contact-us" element={<ContactPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
