const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "..", "data", "orders.json");

let writeQueue = Promise.resolve();

function readAll() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

function writeAll(orders) {
  writeQueue = writeQueue.then(
    () =>
      new Promise((resolve, reject) => {
        fs.writeFile(DB_FILE, JSON.stringify(orders, null, 2), (err) => {
          if (err) reject(err);
          else resolve();
        });
      })
  );
  return writeQueue;
}

async function addOrder(order) {
  const orders = readAll();
  orders.push(order);
  await writeAll(orders);
  return order;
}

async function findOrderBySessionId(sessionId) {
  return readAll().find((o) => o.stripeSessionId === sessionId);
}

async function listOrders({ status } = {}) {
  const orders = readAll();
  if (status === "pending") return orders.filter((o) => !o.fulfilled);
  if (status === "fulfilled") return orders.filter((o) => o.fulfilled);
  return orders;
}

async function markFulfilled(orderId) {
  const orders = readAll();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;
  order.fulfilled = true;
  order.fulfilledAt = new Date().toISOString();
  await writeAll(orders);
  return order;
}

module.exports = {
  addOrder,
  findOrderBySessionId,
  listOrders,
  markFulfilled,
};
