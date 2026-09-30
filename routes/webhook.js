const express = require("express");
const stripe = require("../lib/stripe");
const db = require("../lib/db");

const router = express.Router();

// IMPORTANTE: esta rota precisa do corpo em "raw" (não em JSON) para validar
// a assinatura do Stripe. Isso é configurado no server.js antes do express.json().
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = webhookSecret
        ? stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
        : JSON.parse(req.body.toString());
    } catch (err) {
      console.error("Assinatura do webhook inválida:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const alreadyExists = await db.findOrderBySessionId(session.id);
      if (!alreadyExists) {
        const minecraftField = (session.custom_fields || []).find(
          (f) => f.key === "minecraft_username"
        );

        await db.addOrder({
          id: session.id,
          stripeSessionId: session.id,
          createdAt: new Date().toISOString(),
          status: "pago",
          fulfilled: false,
          minecraftUsername:
            (minecraftField && minecraftField.text && minecraftField.text.value) || null,
          customerEmail:
            (session.customer_details && session.customer_details.email) || null,
          amountTotal: session.amount_total,
          currency: session.currency,
          items: session.metadata && session.metadata.cart_json
            ? JSON.parse(session.metadata.cart_json)
            : [],
        });

        console.log(
          `[loja] Nova encomenda paga: ${session.id} (${session.amount_total / 100} ${session.currency})`
        );
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
