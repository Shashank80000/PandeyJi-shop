import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios.js";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await api.post("/admin/login", form);

      // ✅ Save token
      
      localStorage.setItem("adminToken", res.data.token);

      // ✅ Redirect to dashboard
      navigate("/admin/products");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto grid w-full max-w-[980px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        <section className="bg-gradient-to-br from-slate-900 to-slate-700 p-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Admin Panel</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">Control products, orders, and inventory in one place.</h1>
          <p className="mt-5 max-w-sm text-slate-300">This area is restricted. Only authorized admins can access product management features.</p>
        </section>

        <section className="p-10">
          <h2 className="mb-2 text-3xl font-black text-slate-900">
            Admin Login
          </h2>
          <p className="mb-6 text-sm text-slate-500">Use your admin credentials to continue.</p>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
            className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-teal-700 text-base font-bold text-white transition hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
        </section>
      </div>
    </div>
  );
}