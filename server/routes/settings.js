const express = require("express");
const Organization = require("../models/Organization");
const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// GET /api/settings
router.get("/", async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organization);
    res.json({ defaultLowStockThreshold: org.defaultLowStockThreshold });
  } catch (err) {
    res.status(500).json({ message: "Could not load settings" });
  }
});

// PUT /api/settings
router.put("/", async (req, res) => {
  try {
    const value = Number(req.body.defaultLowStockThreshold);

    if (req.body.defaultLowStockThreshold === "" || !Number.isInteger(value) || value < 0) {
      return res
        .status(400)
        .json({ message: "Threshold must be a whole number, 0 or more" });
    }

    const org = await Organization.findById(req.user.organization);
    org.defaultLowStockThreshold = value;
    await org.save();

    res.json({ defaultLowStockThreshold: org.defaultLowStockThreshold });
  } catch (err) {
    res.status(500).json({ message: "Could not save settings" });
  }
});

module.exports = router;
