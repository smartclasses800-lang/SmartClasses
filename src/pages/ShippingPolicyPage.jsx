import PolicyLayout from './PolicyLayout'

function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <p>
        All book orders are shipped through India Post to the address provided during
        checkout. Please ensure all address fields are complete and accurate.
      </p>
      <p>
        Once payment is confirmed and order is processed, dispatch will be initiated.
        Expected delivery timelines vary by location and India Post transit schedules.
      </p>
      <p>
        After shipment, you will receive a confirmation email containing your tracker
        ID for package tracking.
      </p>
      <p>
        Delays caused by weather, public holidays, remote-region routing, or courier
        operational issues are outside our direct control.
      </p>
      <p>
        If tracker email is not received after successful payment, contact support
        immediately using the Contact Us details.
      </p>
    </PolicyLayout>
  )
}

export default ShippingPolicyPage
