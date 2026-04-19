import PolicyLayout from './PolicyLayout'

const supportPhone = import.meta.env.VITE_SUPPORT_PHONE || '+91 85588 00797'
const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'illamerpunjab@gmail.com'

function ContactPage() {
  return (
    <PolicyLayout title="Contact Us">
      <p>
        For payment issues, order support, shipping updates, or missing confirmation
        email, please contact us:
      </p>
      <p>
        Phone: {supportPhone}
        <br />
        Email: {supportEmail}
      </p>
      <p>
        Support Hours: Monday to Saturday, 10:00 AM to 6:00 PM (IST).
      </p>
      <p>
        If payment is completed but you did not receive confirmation email, call us
        or send an email with your full name, phone number, and payment ID.
      </p>
    </PolicyLayout>
  )
}

export default ContactPage
