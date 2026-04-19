import PolicyLayout from './PolicyLayout'

function CancellationRefundPage() {
  return (
    <PolicyLayout title="Cancellation & Refund Policy">
      <p>
        Strict policy: All purchases are final. Once a payment is successfully
        completed, the order is non-cancellable and non-refundable.
      </p>
      <p>
        Due to the nature of book publishing, packaging, and dispatch handling,
        cancellations cannot be accepted after order confirmation.
      </p>
      <p>
        Please verify name, phone, email, language medium, and full address before
        submitting payment.
      </p>
      <p>
        In case of duplicate payment due to technical issue, contact support with
        payment proof for manual review.
      </p>
      <p>
        For order communication issues such as missing confirmation email, call or
        email support immediately so we can assist.
      </p>
    </PolicyLayout>
  )
}

export default CancellationRefundPage
