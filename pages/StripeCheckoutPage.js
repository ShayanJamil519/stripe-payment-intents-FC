import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "./components/StripeCheckoutForm";

const StripeCheckoutPage = () => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm />
    </Elements>
  );
};

export default StripeCheckoutPage;
