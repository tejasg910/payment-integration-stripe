const express = require("express");
const dotenv = require("dotenv").config();

var expressLayouts = require("express-ejs-layouts");

var app = express();

app.set("view engine", "ejs");

app.use(expressLayouts);
const stripe = require("stripe")(
  "sk_test_51MyIicSH0DotAFf8Obdj6cC7scfi1YT6msjueiGUXZJYDebeWUBDVZX8M1xxTJOFo1ksKtDmgFirS307AMOP3Dwh00KjEIxla7"
);

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
app.get("/", function (req, res) {
  var locals = {
    title: "Page Title",
    description: "Page Description",
    header: "Page Header",
  };
  res.render("checkout", locals);
});

app.listen(process.env.PORT, () => {
  console.log("Server started at port", process.env.PORT);
});
