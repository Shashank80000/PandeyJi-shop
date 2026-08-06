    import React from 'react'
    import { useState } from 'react'
    import { useNavigate } from 'react-router';
    import api from '../../api/axios'
    
    function Signup() {
      const navigate = useNavigate();
      const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
      })
      const [msg, setmsg] = useState("");
      const [msgType, setMsgType] = useState("");

    
      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
      }



    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{
          const response = await api.post('/auth/signup',form);
          setmsg(response.data.message);
          setMsgType("success");
          setForm({ name: "", email: "", password: "" });

        }catch(e){
          setmsg(e.response?.data?.message || "An error occurred");
          setMsgType("error");
        }
    
    }

    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-10">
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
          <div className="bg-gradient-to-br from-teal-800 to-cyan-700 p-10 text-white">
            <h3 className="text-lg font-semibold tracking-wide text-cyan-100">Pandey Shop</h3>

            <div className="mt-16">
              <h1 className="text-5xl font-black leading-tight">Create your account</h1>
              <p className="mt-4 max-w-sm text-base text-cyan-100">Start shopping with fast checkout, saved addresses, and order tracking.</p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-8 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-800 hover:bg-teal-50"
              >
                Log in
              </button>
            </div>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-3xl font-black text-slate-900">Sign Up</h2>
              <p className="text-sm text-slate-500">Use your name, email, and secure password.</p>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
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
                  type="password"
                  id="password"
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
                Create Account
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
    export default Signup