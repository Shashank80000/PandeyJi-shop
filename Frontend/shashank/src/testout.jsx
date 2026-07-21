import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router";
import ShapeGrid from "../../components/ShapeGrid/ShapeGrid";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadProducts = async () => {
    try {
      const res = await api.get("/products?search=" + search + "&category=" + category);
      const productList = Array.isArray(res.data) ? res.data : Array.isArray(res.data.products) ? res.data.products : [];
      setProducts(productList);
      setLoadError("");
    } catch (error) {
      setProducts([]);
      setLoadError(error.response.data.message || "Unable to load products");
    }
  };

  useEffect(() => { loadProducts(); }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Please log in"); return; }
    try {
      const res = await api.post("/cart/add", { userId, productId });
      const itemCount = (res.data.cart.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      localStorage.setItem("cartCount", String(itemCount));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) { alert(error.response.data.message || "Unable to add item to cart"); }
  };

  return (
    <div className="bg-slate-50 pb-12">
      <div role="region" aria-label="Promotion" className="bg-blue-700 px-4 py-2.5 flex items-center justify-center text-center md:px-6">
        <div className="flex items-center justify-center flex-wrap gap-y-4 gap-x-6 pr-6">
          <p className="text-sm font-medium text-white">Limited time offer - </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold bg-white px-2.5 py-1.5 rounded-md mx-1">04</span>
              <span className="text-xs text-slate-50">DAYS</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold bg-white px-2.5 py-1.5 rounded-md mx-1">06</span>
              <span className="text-xs text-slate-50">HRS</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold bg-white px-2.5 py-1.5 rounded-md mx-1">42</span>
              <span className="text-xs text-slate-50">MIN</span>
            </div>
          <span className="text-sm text-white">Use code - <span className="font-bold text-white ml-1">SAVE20</span>
        </div>
        <button type="button" aria-label="Dismiss" className="absolute right-4 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3 fill-slate-50" viewBox="0 0 329.269 329">
            <path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164z" />
          </svg>
        </button>
      </div>
  );
}
