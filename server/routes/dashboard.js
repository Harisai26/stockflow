const express = require("express");
const Product = require("../models/Product");
const Organization = require("../models/Organization");
const protect = require("../middleware/auth");

const router = express.Router();

// GET /api/dashboard
router.get("/", protect, async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organization);
    const products = await Product.find({ organization: req.user.organization });

    let totalQuantity = 0;
    const lowStockItems = [];

    products.forEach((p) => {
      totalQuantity += p.quantity;

      const limit =
        p.lowStockThreshold !== null
          ? p.lowStockThreshold
          : org.defaultLowStockThreshold;

      if (p.quantity <= limit) {
        lowStockItems.push({
          _id: p._id,
          name: p.name,
          sku: p.sku,
          quantity: p.quantity,
          lowStockThreshold: limit,
        });
      }
    });

    res.json({
      totalProducts: products.length,
      totalQuantity,
      defaultLowStockThreshold: org.defaultLowStockThreshold,
      lowStockItems,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not load dashboard" });
  }
});

module.exports = router;
