import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";
import { useNavigate } from "react-router";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            setErrorMessage("");
            const response = await api.get("/products");
            const productList = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.products)
                    ? response.data.products
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
        <div className="bg-slate-50 py-10">
            <div className="mx-auto w-full max-w-[1200px] px-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900">Product List</h2>
                        <p className="mt-1 text-sm text-slate-500">Manage catalog items and stock in desktop view.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/admin/products/add" className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
                            Add New Product
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-left text-sm uppercase tracking-[0.12em] text-slate-600">
                                <th className="px-5 py-4">Title</th>
                                <th className="px-5 py-4">Price</th>
                                <th className="px-5 py-4">Stock</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-t border-slate-200 text-sm text-slate-700">
                                    <td className="px-5 py-4 font-semibold text-slate-900">{product.title}</td>
                                    <td className="px-5 py-4">${Number(product.price || 0).toFixed(2)}</td>
                                    <td className="px-5 py-4">{Number(product.stock || 0)}</td>
                                    <td className="px-5 py-4">
                                        <Link to={`/admin/products/edit/${product._id}`} className="mr-4 font-semibold text-teal-700 hover:text-teal-900">
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
                                    <td colSpan="4" className="px-4 py-10 text-center text-slate-600">
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
