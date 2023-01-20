import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const ElementForms = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const billingDetails = {
      name: "Usman",
      email: "usmanatcode@gmail.com",
    };

    try {
      const { data: clientSecret } = await axios.post("/api/payment_intents", {
        amount: 10,
        receipt_email: billingDetails.email,
      });

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: billingDetails,
      });

      if (paymentMethodReq.error) {
        setError(paymentMethodReq.error.message);
        setProcessing(false);
        return;
      }

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id,
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return success ? (
    <h5>Payment success. Thank you for your purchase.</h5>
  ) : (
    <div className="my-2">
      <h4>Checkout</h4>
      <Elements stripe={stripePromise}>
        <CardElement
          options={{ hidePostalCode: true }}
          onChange={handleChange}
        />
        <form onSubmit={handleSubmit}>
          <button
            block
            variant="info"
            type="submit"
            disabled={!stripe || processing || disabled || error !== ""}
          >
            {processing ? "loading" : `Pay $${10}`}
          </button>

          {error && <span>{error}</span>}
        </form>
      </Elements>
    </div>
  );
};

export default ElementForms;
