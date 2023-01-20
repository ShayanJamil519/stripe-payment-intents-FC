import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import axios from "axios";
import Router from "next/router";

const CARD_OPTIONS = {
  iconStyle: "solid",
  hidePostalCode: true,
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#000000",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883",
      },
      "::placeholder": {
        color: "#87bbfd",
      },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

const StripeCheckoutForm = () => {
  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState();

  const stripe = useStripe();
  const elements = useElements();

  const handleCardDetailsChange = (event) => {
    event.error ? setCheckoutError(event.error.message) : setCheckoutError();
  };

  const handleFormSubmit = async (ev) => {
    ev.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const billingDetails = {
      name: "Shayan Jamil",
      email: "codeytek@gmail.com",
      address: {
        city: "Karachi",
        line1: "Address 1",
        state: "my state",
        postal_code: "2200",
      },
    };

    setProcessingTo(true);

    const cardElement = elements.getElement("card");
    const price = 10;

    try {
      const { data: clientSecret } = await axios.post(
        "/api/stripe-payment-intent",
        {
          amount: price * 100,
        }
      );

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: billingDetails,
      });

      if (paymentMethodReq.error) {
        setCheckoutError(paymentMethodReq.error.message);
        setProcessingTo(false);
        return;
      }

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id,
      });

      if (error) {
        setCheckoutError(error.message);
        setProcessingTo(false);
        return;
      }

      // On successful payment, redirect to thank you page.
      await Router.push("/ThankYou");
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <h2>Stripe Payment: Pay with card</h2>
        <div>
          <h6>Card Information</h6>
          <CardElement
            options={CARD_OPTIONS}
            onChange={handleCardDetailsChange}
          />
        </div>
        {checkoutError ? <div>{checkoutError}</div> : null}
        <button disabled={isProcessing || !stripe}>
          {isProcessing ? "Processing..." : `Pay $100`}
        </button>
      </form>
    </div>
  );
};

export default StripeCheckoutForm;
