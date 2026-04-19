import PolicyLayout from './PolicyLayout'

function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions">
      <p>
        By placing an order on this website, you agree to provide accurate and
        complete personal and shipping information.
      </p>
      <p>
        Prices, offers, and availability may change without prior notice.
      </p>
      <p>
        Payments are processed through Razorpay. You are responsible for ensuring
        payment method validity and successful transaction completion.
      </p>
      <p>
        Shipping is carried out through India Post. Delivery timelines are estimates
        and can vary based on destination and operational conditions.
      </p>
      <p>
        All sales are final and strictly non-refundable after successful payment,
        except in verified duplicate-payment scenarios reviewed by support.
      </p>
      <p>
        We reserve the right to reject suspicious or incomplete orders to protect
        payment integrity and delivery operations.
      </p>
    </PolicyLayout>
  )
}

export default TermsPage
