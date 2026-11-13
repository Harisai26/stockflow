import { useEffect, useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import api, { getErrorMessage } from "../api";

const Settings = () => {
  const [threshold, setThreshold] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setThreshold(res.data.defaultLowStockThreshold))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (threshold === "" || Number(threshold) < 0) {
      setError("Enter a valid number");
      return;
    }

    try {
      await api.put("/settings", { defaultLowStockThreshold: threshold });
      setMessage("Settings saved");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <SettingsIcon className="text-brand" size={36} />
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-slate-600">Configure your store preferences</p>
        </div>
      </div>

      <div className="card p-6">
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {message && (
          <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label className="mb-2 block font-semibold">Default Low Stock Threshold</label>
          <div className="flex gap-4">
            <input
              type="number"
              min="0"
              className="input"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Update Settings
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Used for any product that doesn't have its own threshold.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Settings;
