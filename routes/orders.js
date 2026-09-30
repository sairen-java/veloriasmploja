const express = require("express");
const db = require("../lib/db");

const router = express.Router();

function requireAdmin(req, res, next) {
  const key = req.header("x-admin-key");
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Não autorizado." });
  }
  next();
}

// GET /api/admin/orders?status=pending|fulfilled
// Pensado para um plugin do servidor (ou um admin) consultar as encomendas
// pagas por entregar (VIPs/keys) e marcá-las como entregues.
router.get("/", requireAdmin, async (req, res) => {
  const orders = await db.listOrders({ status: req.query.status });
  res.json(orders);
});

router.post("/:id/fulfill", requireAdmin, async (req, res) => {
  const order = await db.markFulfilled(req.params.id);
  if (!order) return res.status(404).json({ error: "Encomenda não encontrada." });
  res.json(order);
});

module.exports = router;
