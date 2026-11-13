import { useEffect, useState } from "react";
import { Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import api, { getErrorMessage } from "../api";
import ProductModal from "../components/ProductModal";
import AdjustStockModal from "../components/AdjustStockModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adjustingProduct, setAdjustingProduct] = useState(null);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products", { params: { search } });
      setProducts(res.data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // wait a little after typing before calling the api
  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingProduct(null);
    setAdjustingProduct(null);
    loadProducts();
  };

  const handleDelete = async (product) => {
    const sure = window.confirm(`Delete "${product.name}"? This can't be undone.`);
    if (!sure) return;

    try {
      await api.delete(`/products/${product._id}`);
      loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "-";
    return "₹" + Number(price).toLocaleString("en-IN");
  };

  return (
    <div>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-slate-600">Manage your inventory products</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          className="input pl-10"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">SKU</th>
              <th className="px-4 py-3 font-semibold">Quantity</th>
              <th className="px-4 py-3 font-semibold">Low Stock</th>
              <th className="px-4 py-3 font-semibold">Selling Price</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  No products found. Click "Add Product" to create one.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.sku}</td>
                  <td className="px-4 py-3">{p.quantity}</td>
                  <td className="px-4 py-3">
                    {p.isLowStock ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                        Yes
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.sellingPrice)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1.5 text-brand hover:bg-blue-200"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setAdjustingProduct(p)}
                        title="Adjust stock"
                        className="rounded-md bg-slate-100 px-2.5 py-1.5 text-slate-600 hover:bg-slate-200"
                      >
                        <SlidersHorizontal size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="flex items-center gap-1 rounded-md bg-red-100 px-3 py-1.5 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {adjustingProduct && (
        <AdjustStockModal
          product={adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default Products;
