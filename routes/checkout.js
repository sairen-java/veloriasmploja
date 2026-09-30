const express = require("express");
const rateLimit = require("express-rate-limit");
const stripe = require("../lib/stripe");
const { getProductById } = require("../config/products");

const router = express.Router();

const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados pedidos. Tenta novamente daqui a um minuto." },
});

const DOMAIN = process.env.DOMAIN || "http://localhost:3000";

// Cria uma sessão de checkout do Stripe a partir do carrinho enviado pelo cliente.
// Os preços nunca são confiados ao cliente: são sempre lidos do catálogo no servidor.
router.post("/session", checkoutLimiter, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "O carrinho está vazio." });
    }

    const cartSummary = [];
    const line_items = [];

    for (const rawItem of items) {
      const product = getProductById(rawItem && rawItem.id);
      const quantity = Math.min(
        Math.max(parseInt(rawItem && rawItem.quantity, 10) || 0, 0),
        20
      );

      if (!product || quantity <= 0) {
        return res
          .status(400)
          .json({ error: "Item inválido no carrinho." });
      }

      line_items.push({
        quantity,
        price_data: {
          currency: "eur",
          unit_amount: product.price,
          product_data: {
            name: `${product.name} — Veloria SMP`,
            description: product.tagline,
          },
        },
      });

      cartSummary.push({
        id: product.id,
        name: product.name,
        quantity,
        unitPrice: product.price,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/cancel.html`,
      custom_fields: [
        {
          key: "minecraft_username",
          label: { type: "custom", custom: "Nick no Minecraft (exato)" },
          type: "text",
          text: { minimum_length: 3, maximum_length: 16 },
        },
      ],
      metadata: {
        cart_json: JSON.stringify(cartSummary),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar sessão de checkout:", err.message);
    res.status(500).json({ error: "Não foi possível iniciar o pagamento." });
  }
});

// Usado pela página de sucesso para confirmar o estado do pagamento ao cliente.
router.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    if (!session) return res.status(404).json({ error: "Sessão não encontrada." });

    const minecraftField = (session.custom_fields || []).find(
      (f) => f.key === "minecraft_username"
    );

    res.json({
      paid: session.payment_status === "paid",
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details && session.customer_details.email,
      minecraftUsername: minecraftField && minecraftField.text && minecraftField.text.value,
      items: session.metadata && session.metadata.cart_json
        ? JSON.parse(session.metadata.cart_json)
        : [],
    });
  } catch (err) {
    console.error("Erro ao obter sessão:", err.message);
    res.status(404).json({ error: "Sessão não encontrada." });
  }
});

module.exports = router;
