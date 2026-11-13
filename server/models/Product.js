const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    description: { type: String, default: "" },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    costPrice: { type: Number, default: null, min: 0 },
    sellingPrice: { type: Number, default: null, min: 0 },
    // null means "use the default from settings"
    lowStockThreshold: { type: Number, default: null, min: 0 },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// same SKU can exist in different orgs, but not twice in one org
productSchema.index({ organization: 1, sku: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
