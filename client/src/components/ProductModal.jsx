import { useState } from "react";
import { X } from "lucide-react";
import api, { getErrorMessage } from "../api";

const emptyForm = {
  name: "",
  sku: "",
  description: "",
  quantity: "",
  costPrice: "",
  sellingPrice: "",
  lowStockThreshold: "",
};

// product is passed when editing, nothing when adding a new one
const ProductModal = ({ product, onClose, onSaved }) => {
  const isEdit = Boolean(product);

  const [form, setForm] = useState(
    isEdit
      ? {
          name: product.name,
          sku: product.sku,
          description: product.description || "",
          quantity: product.quantity,
          costPrice: product.costPrice ?? "",
          sellingPrice: product.sellingPrice ?? "",
          lowStockThreshold: product.lowStockThreshold ?? "",
        }
      : emptyForm
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.sku.trim()) {
      setError("Name and SKU are required");
      return;
    }
    if (form.quantity === "" || Number(form.quantity) < 0) {
      setError("Enter a valid quantity");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/products/${product._id}`, form);
      } else {
        await api.post("/products", form);
      }
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card w-full max-w-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X size={22} />
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input name="name" className="input" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cost Price (Optional)</label>
              <input
                type="number"
                min="0"
                name="costPrice"
                className="input"
                placeholder="₹"
                value={form.costPrice}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                SKU <span className="text-red-500">*</span>
              </label>
              <input name="sku" className="input" value={form.sku} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Selling Price (Optional)</label>
              <input
                type="number"
                min="0"
                name="sellingPrice"
                className="input"
                placeholder="₹"
                value={form.sellingPrice}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Quantity on Hand <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                name="quantity"
                className="input"
                value={form.quantity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Low Stock Threshold</label>
              <input
                type="number"
                min="0"
                name="lowStockThreshold"
                className="input"
                placeholder="Leave empty to use default"
                value={form.lowStockThreshold}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Description (Optional)</label>
              <textarea
                name="description"
                rows="2"
                className="input"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
