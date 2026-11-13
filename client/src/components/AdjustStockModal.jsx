import { useState } from "react";
import { X } from "lucide-react";
import api, { getErrorMessage } from "../api";

// small popup to add or remove units, e.g. +10 or -3
const AdjustStockModal = ({ product, onClose, onSaved }) => {
  const [change, setChange] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.patch(`/products/${product._id}/adjust`, { change, note });
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Adjust stock</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          {product.name} ({product.sku}) - currently {product.quantity} units
        </p>

        {error && (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Change (+ or -)</label>
            <input
              type="number"
              className="input"
              placeholder="e.g. 10 or -3"
              value={change}
              onChange={(e) => setChange(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Note (optional)</label>
            <input
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustStockModal;
