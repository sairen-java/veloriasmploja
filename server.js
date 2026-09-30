require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const webhookRoutes = require("./routes/webhook");
const productRoutes = require("./routes/products");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());

// O webhook do Stripe precisa do corpo em "raw", por isso é montado
// ANTES do express.json() global.
app.use("/webhook/stripe", webhookRoutes);

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin/orders", orderRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Loja Veloria SMP a correr em http://localhost:${PORT}`);
});
