const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "[aviso] STRIPE_SECRET_KEY não está definida no .env — os pagamentos não vão funcionar."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

module.exports = stripe;
