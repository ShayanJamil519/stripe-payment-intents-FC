import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// ----------------------------------

// You can test these methods respectively by changing the url in search bar

// /
// It includes all the code in pages/index.js and pages/api/server.js file. You need to run both side by side

// /CheckOutPage
// It includes the code in pages/CheckOutPage.js and components/CheckOutForm.js file. This method is close to your solution but i don't know why status and paymentIntent.client_secret is undefined

// /StripeCheckoutPage
// It includes the code in pages/StripeCheckoutPage.js, ThankYou.js, components/StripeCheckoutForm.js and api/stripe-payment-intent.js files. This method shows processing at the start but then gives internal server later
