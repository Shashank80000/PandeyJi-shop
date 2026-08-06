import React from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router';
import api from '../../api/axios'
import { Link } from 'react-router';


function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [msg, setmsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setmsg("");
    setMsgType("");

    try {
      const res = await api.post("/auth/login", form);

      const token = res?.data?.token;
      const resolvedUserId =
        res?.data?.userId ||
        res?.data?.user?.userId ||
        res?.data?.user?.userID;

      if (!token || !resolvedUserId) {
        setmsg("Login response is incomplete. Please try again.");
        setMsgType("error");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", resolvedUserId);
      if (res?.data?.user?.name) {
        localStorage.setItem("name", res.data.user.name);
      }

      setmsg(res?.data?.message || "Login successful");
      setMsgType("success");
      
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      setmsg(error?.response?.data?.message || "Login failed");
      setMsgType("error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
        <div className="bg-gradient-to-br from-slate-900 via-teal-900 to-teal-700 p-10 text-white">
          <h3 className="text-lg font-semibold tracking-wide text-teal-100">Pandey Shop</h3>

          <div className="mt-16">
            <h1 className="text-5xl font-black leading-tight">Welcome back</h1>
            <p className="mt-4 max-w-sm text-base text-teal-100">Log in to manage your cart, addresses, and order history from your desktop dashboard.</p>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="mt-8 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50"
            >
              Create Account
            </button>
          {/* Adnin Login  */}

           <Link to="/admin/login" className="t-8 rounded-xl m-4 bg-white px-5 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50">
                        Admin Login
                    </Link>

          </div>
        </div>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-3xl font-black text-slate-900">Login</h2>
            <p className="text-sm text-slate-500">Use your registered email and password.</p>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-700 py-3 font-bold text-white transition hover:bg-teal-800"
            >
              Log In
            </button>

            {msg && (
              <p
                className={`text-sm ${
                  msgType === "success" ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login