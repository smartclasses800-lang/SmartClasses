import PolicyLayout from './PolicyLayout'

function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>
        We collect customer details only for order fulfillment, payment processing,
        shipping coordination, and support communication.
      </p>
      <p>
        Data collected during checkout may include your name, email address, phone
        number, selected medium, and complete shipping address. Payment details are
        securely handled by Razorpay and are not stored directly on this website.
      </p>
      <p>
        Your details are shared only with trusted service providers required to
        complete your order, such as payment gateway and India Post shipping process.
      </p>
      <p>
        We do not sell your personal information. We retain order information for
        record-keeping, support, and legal compliance purposes.
      </p>
      <p>
        If you need corrections in submitted details, contact support immediately
        before dispatch.
      </p>
    </PolicyLayout>
  )
}

export default PrivacyPolicyPage
