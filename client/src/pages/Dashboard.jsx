import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Box, Boxes, Settings } from "lucide-react";
import api, { getErrorMessage } from "../api";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [threshold, setThreshold] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
      setThreshold(res.data.defaultLowStockThreshold);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleQuickUpdate = async () => {
    setError("");
    setMessage("");
    try {
      await api.put("/settings", { defaultLowStockThreshold: threshold });
      setMessage("Threshold updated");
      loadDashboard(); // low stock list may change now
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!data) {
    return <p className="text-slate-500">{error || "Loading..."}</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
      <p className="mb-6 mt-1 text-lg text-slate-600">
        Welcome back! Here's your inventory overview.
      </p>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {message && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </p>
      )}

      {/* summary cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card flex items-center gap-5 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-brand">
            <Box size={32} />
          </div>
          <div>
            <p className="text-lg font-medium">Total Products</p>
            <p className="text-4xl font-bold">{data.totalProducts}</p>
          </div>
        </div>

        <div className="card flex items-center gap-5 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Boxes size={32} />
          </div>
          <div>
            <p className="text-lg font-medium">Total Stock Quantity</p>
            <p className="text-4xl font-bold">{data.totalQuantity}</p>
          </div>
        </div>

        <div className="card bg-blue-50 p-6">
          <div className="mb-3 flex items-center gap-3">
            <Settings className="text-brand" size={28} />
            <div>
              <p className="text-lg font-semibold">Quick Settings</p>
              <p className="text-sm text-slate-600">
                Set your default low stock threshold
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              min="0"
              className="input"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
            <button onClick={handleQuickUpdate} className="btn-primary">
              Update
            </button>
          </div>
        </div>
      </div>

      {/* low stock table */}
      <div className="card mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={28} />
            <h2 className="text-2xl font-semibold">Low Stock Items</h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-medium text-brand"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-base">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Quantity on Hand</th>
                <th className="px-4 py-3 font-semibold">Low Stock Threshold</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                    Nothing is running low.
                  </td>
                </tr>
              ) : (
                data.lowStockItems.map((item) => (
                  <tr key={item._id} className="border-t border-slate-200 text-base">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.sku}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-600">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.lowStockThreshold}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
