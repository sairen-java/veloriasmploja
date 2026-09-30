const express = require("express");
const { getProducts } = require("../config/products");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getProducts());
});

module.exports = router;
