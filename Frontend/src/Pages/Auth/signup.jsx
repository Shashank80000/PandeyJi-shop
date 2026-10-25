import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useNavigate, Link } from "react-router";
import api from "../../api/axios";

function Signup() {
 const navigate = useNavigate();
 const [form, setForm] = useState({ name: "", email: "", password: "" });
 const [msg, setMsg] = useState("");
 const [msgType, setMsgType] = useState("");

 const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

 const handleSubmit = async (event) => {
  event.preventDefault();
  try {
   const response = await api.post("/auth/signup", form);
   setMsg(response.data.message);
   setMsgType("success");
   setForm({ name: "", email: "", password: "" });
  } catch (error) {
   setMsg(error.response?.data?.message || "An error occurred");
   setMsgType("error");
  }
 };

 return (
  <main className="min-h-[calc(100vh-80px)] bg-surface px-4 py-8 sm:px-6 lg:py-14">
   <div className="mx-auto grid w-full max-w-[1080px] overflow-hidden rounded-[2rem] bg-card shadow-[0_25px_80px_rgba(103,76,58,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
    <section className="order-2 p-7 sm:p-12 lg:order-1 lg:p-14">
     <div className="mb-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">Join the collection</p><h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Create your account</h1><p className="mt-2 text-sm leading-6 text-ink-soft">Save your shopping details and make every checkout feel effortless.</p></div>
     <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block"><span className="mb-2 block text-sm font-bold text-ink-soft">Name</span><span className="flex h-13 items-center rounded-2xl border border-line-strong bg-[#fffaf7] px-4 focus-within:border-[#e97855] focus-within:ring-4 focus-within:ring-[#e97855]/10"><UserRound size={17} className="text-ink-faint" /><input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" /></span></label>
      <label className="block"><span className="mb-2 block text-sm font-bold text-ink-soft">Email</span><span className="flex h-13 items-center rounded-2xl border border-line-strong bg-[#fffaf7] px-4 focus-within:border-[#e97855] focus-within:ring-4 focus-within:ring-[#e97855]/10"><Mail size={17} className="text-ink-faint" /><input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" /></span></label>
      <label className="block"><span className="mb-2 block text-sm font-bold text-ink-soft">Password</span><span className="flex h-13 items-center rounded-2xl border border-line-strong bg-[#fffaf7] px-4 focus-within:border-[#e97855] focus-within:ring-4 focus-within:ring-[#e97855]/10"><LockKeyhole size={17} className="text-ink-faint" /><input type="password" id="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a password" required className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" /></span></label>
      <button type="submit" className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-accent font-black text-white transition hover:bg-accent-strong">Create account <ArrowRight size={17} /></button>
      {msg && <p className={`rounded-xl px-4 py-3 text-sm font-semibold ${msgType === "success" ? "bg-success-soft text-success-ink" : "bg-accent-soft text-accent-ink"}`}>{msg}</p>}
     </form>
     <p className="mt-8 text-center text-sm text-ink-soft">Already have an account? <button type="button" onClick={() => navigate("/login")} className="font-black text-accent hover:text-accent-strong">Sign in</button></p>
    </section>

    <section className="relative order-1 overflow-hidden bg-[#f5d7c9] p-8 sm:p-12 lg:order-2 lg:p-14">
     <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[#cfe4e4]/80" /><div className="absolute -left-20 top-16 h-40 w-40 rounded-full bg-[#efb6c3]/60" />
     <div className="relative flex h-full flex-col justify-between"><div><Link to="/" className="flex items-center gap-2 text-xl font-black text-ink"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-white">P</span>Pandey Shop</Link><p className="mt-16 text-xs font-black uppercase tracking-[0.2em] text-accent-ink">A softer way to shop</p><h2 className="mt-3 max-w-sm text-4xl font-black leading-tight text-ink sm:text-5xl">Bring your next find home.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-[#765c4e]">Browse real products, keep your cart close, and return whenever inspiration calls.</p></div><div className="mt-14 rounded-2xl bg-card/55 p-4 text-sm font-bold text-[#765c4e]">Your account makes checkout quicker and order tracking easier.</div></div>
    </section>
   </div>
  </main>
 );
}

export default Signup;
