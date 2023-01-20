const express = require("express");
const bodyParser = require("body-parser");
// const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.post("/api/create-payment-intent", async(req, res) => {
app.post(
    "http://localhost:3000/api/create-payment-intent",
    async(req, res) => {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: req.body.amount,
                currency: "usd",
            });

            console.log("Payment Intent Success " + paymentIntent.client_secret);
            // res.json({ client_secret: paymentIntent.client_secret });
            res.send({ client_secret: paymentIntent.client_secret });
        } catch (err) {
            console.log("Payment Intent Fail " + err.message);
            // res.status(500).json({ error: err.message });
            res.send({ error: err.message });
        }
    }
);

app.listen(5000, () => {
    console.log("Server started on port 5000");
});