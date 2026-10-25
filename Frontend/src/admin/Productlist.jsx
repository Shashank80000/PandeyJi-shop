import { useEffect, useState } from "react";
import api from "../api/axios";
import { getCatalogue, invalidateCatalogue } from "../services/resourceCache.js";
import { Link } from "react-router";
import { useNavigate } from "react-router";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setErrorMessage("");
      const data = await getCatalogue({}, { ttl: 0, force: true });
      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : [];
      setProducts(productList);
    } catch (err) {
      setProducts([]);
      setErrorMessage(err.response?.data?.message || "Unable to load products");
    }
  }

  const deletedProduct = async (id) => {
    try {
      await api.delete(`/admin/delete/${id}`);
      invalidateCatalogue();
      alert("Product deleted successfully!");
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  //logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // remove admin auth
    navigate("/admin/login"); // redirect to login
  };

  return (
    <div className="bg-surface py-10">
      <div className="mx-auto w-full max-w-300 px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-ink sm:text-4xl">Product List</h2>
            <p className="mt-1 text-sm text-ink-soft">Manage catalog items and stock.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            {/* add new product button */}
            <Link to="/admin/products/add" className="rounded-xl bg-accent-strong px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong">
              Add New Product
            </Link>

            {/* order button */}
            <Link
              to="/admin/orders"
              className="rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-strong"
            >
              View Orders
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* overflow-x-auto keeps wide tables scrollable instead of breaking the page on phones */}
        <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-sm">
          <table className="w-full min-w-140 table-auto border-collapse">
            <thead>
              <tr className="bg-card-soft text-left text-sm uppercase tracking-[0.12em] text-ink-soft">
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-line text-sm text-ink">
                  <td className="px-5 py-4 font-semibold text-ink">{product.title}</td>
                  <td className="px-5 py-4">${Number(product.price || 0).toFixed(2)}</td>
                  <td className="px-5 py-4">{Number(product.stock || 0)}</td>
                  <td className="px-5 py-4">
                    <Link to={`/admin/products/edit/${product._id}`} className="mr-4 font-semibold text-accent-strong hover:text-teal-900">
                      Edit
                    </Link>
                    <button
                      onClick={() => deletedProduct(product._id)}
                      className="font-semibold text-rose-700 hover:text-rose-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-10 text-center text-ink-soft">
                    {errorMessage || "No products found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
