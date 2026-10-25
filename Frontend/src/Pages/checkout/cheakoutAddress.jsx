import { useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router";
import { addStaticAddress } from "../../services/staticStore.js";
import { getStaticCartItems } from "../../services/staticCart.js";
import { invalidateAddresses } from "../../services/resourceCache.js";

export default function CheckoutAddress() {
 const userId = localStorage.getItem("userId");
 const navigate = useNavigate();
 const [form, setForm] = useState({ fullName: "", phone: "", adressLine: "", city: "", state: "", pincode: "" });
 const [error, setError] = useState("");
 const [saving, setSaving] = useState(false);
 const saveAddress = async (event) => {
  event.preventDefault();
  try {
   setSaving(true); setError("");
   if (getStaticCartItems().length > 0) addStaticAddress(form);
   else if (userId) { await api.post("/address/add", { ...form, userId }); invalidateAddresses(userId); }
   else addStaticAddress(form);
   navigate("/checkout");
  } catch (requestError) { setError(requestError?.response?.data?.message || "Unable to save address"); }
  finally { setSaving(false); }
 };
 return <main className="min-h-screen bg-surface py-10"><div className="mx-auto w-full max-w-[900px] px-4 sm:px-6"><div className="rounded-3xl border-line bg-card p-6 shadow-sm sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-strong">Checkout</p><h1 className="mt-2 text-4xl font-black">Add Delivery Address</h1><form onSubmit={saveAddress} className="mt-8 grid gap-5 md:grid-cols-2">{[["fullName", "Full Name"], ["phone", "Phone Number"], ["adressLine", "Address"], ["city", "City"], ["state", "State"], ["pincode", "Pincode"]].map(([name, label]) => <label key={name} className={name === "adressLine" ? "md:col-span-2" : ""}><span className="mb-2 block font-semibold text-ink">{label}</span><input name={name} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} required className="h-12 w-full rounded-xl border border-line-strong px-4" /></label>)}{error && <p className="md:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<div className="flex gap-3 md:col-span-2"><button type="button" onClick={() => navigate("/checkout")} className="h-12 rounded-xl border px-6 font-bold">Cancel</button><button type="submit" disabled={saving} className="h-12 rounded-xl bg-accent-strong px-6 font-bold text-white disabled:opacity-60">{saving ? "Saving..." : "Save Address"}</button></div></form></div></div></main>;
}