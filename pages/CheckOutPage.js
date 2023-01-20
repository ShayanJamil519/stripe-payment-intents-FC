import React from "react";
import Stripe from "stripe";
import { parseCookies, setCookie } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckOutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const getServerSideProps = async (ctx) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let paymentIntent;

  const { paymentIntentId } = await parseCookies(ctx);

  if (paymentIntentId) {
    // paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Comment and UnComment line 18 and 23 alternatively to check which may work for you

    const res = await fetch(
      `https://merchant-ui-api.stripe.com/payment_intents/${paymentIntentId}`,
      { mode: "no-cors" }
    );
    paymentIntent = await res.json();

    return {
      props: {
        paymentIntent,
      },
    };
  }

  paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "gbp",
  });

  setCookie(ctx, "paymentIntentId", paymentIntent.id);

  return {
    props: {
      paymentIntent,
    },
  };
};

const CheckOutPage = ({ paymentIntent }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm paymentIntent={paymentIntent} />
  </Elements>
);

export default CheckOutPage;
