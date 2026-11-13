const express = require("express");
const Product = require("../models/Product");
const Organization = require("../models/Organization");
const protect = require("../middleware/auth");

const router = express.Router();

// every route below needs a logged in user
router.use(protect);

// empty string / undefined -> null, otherwise a number
const toNumberOrNull = (value) => {
  if (value === "" || value === undefined || value === null) return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
};

const validateProduct = (body) => {
  if (!body.name || !body.name.trim()) return "Name is required";
  if (!body.sku || !body.sku.trim()) return "SKU is required";

  const qty = Number(body.quantity);
  if (body.quantity === "" || body.quantity === undefined || isNaN(qty)) {
    return "Quantity is required";
  }
  if (!Number.isInteger(qty) || qty < 0) {
    return "Quantity must be a whole number, 0 or more";
  }

  const numberFields = ["costPrice", "sellingPrice", "lowStockThreshold"];
  for (const field of numberFields) {
    const val = toNumberOrNull(body[field]);
    if (val !== null && val < 0) return `${field} cannot be negative`;
  }

  return null;
};

// GET /api/products?search=abc
router.get("/", async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organization);
    const filter = { organization: req.user.organization };

    if (req.query.search) {
      const regex = new RegExp(
        req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [{ name: regex }, { sku: regex }];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // add isLowStock so the frontend doesn't have to work it out
    const result = products.map((p) => {
      const limit =
        p.lowStockThreshold !== null
          ? p.lowStockThreshold
          : org.defaultLowStockThreshold;
      return { ...p.toObject(), isLowStock: p.quantity <= limit };
    });

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid product id" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const error = validateProduct(req.body);
    if (error) return res.status(400).json({ message: error });

    const product = await Product.create({
      organization: req.user.organization,
      name: req.body.name,
      sku: req.body.sku,
      description: req.body.description || "",
      quantity: Number(req.body.quantity),
      costPrice: toNumberOrNull(req.body.costPrice),
      sellingPrice: toNumberOrNull(req.body.sellingPrice),
      lowStockThreshold: toNumberOrNull(req.body.lowStockThreshold),
      lastUpdatedBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {
    // 11000 = duplicate key (same SKU in this org)
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "A product with this SKU already exists" });
    }
    console.log(err);
    res.status(500).json({ message: "Could not create product" });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const error = validateProduct(req.body);
    if (error) return res.status(400).json({ message: error });

    const product = await Product.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name;
    product.sku = req.body.sku;
    product.description = req.body.description || "";
    product.quantity = Number(req.body.quantity);
    product.costPrice = toNumberOrNull(req.body.costPrice);
    product.sellingPrice = toNumberOrNull(req.body.sellingPrice);
    product.lowStockThreshold = toNumberOrNull(req.body.lowStockThreshold);
    product.lastUpdatedBy = req.user._id;

    await product.save();
    res.json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "A product with this SKU already exists" });
    }
    console.log(err);
    res.status(500).json({ message: "Could not update product" });
  }
});

// PATCH /api/products/:id/adjust  body: { change: -3, note: "damaged" }
router.patch("/:id/adjust", async (req, res) => {
  try {
    const change = Number(req.body.change);
    if (!Number.isInteger(change) || change === 0) {
      return res.status(400).json({ message: "Enter a whole number like 5 or -3" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      organization: req.user.organization,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity + change < 0) {
      return res.status(400).json({ message: "Stock cannot go below 0" });
    }

    product.quantity += change;
    product.lastUpdatedBy = req.user._id;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Could not adjust stock" });
  }
});

// DELETE /api/products/:id  (hard delete)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organization,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid product id" });
  }
});

module.exports = router;
