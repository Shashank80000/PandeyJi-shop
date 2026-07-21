import { useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router";

export default function CheckoutAddress() {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [form , setForm] = useState({
        fullName:"",
        phone:"",
        adressLine: "",
        city: "",
        state: "",
        pincode: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const [error, setError] = useState("");

    const saveAddress = async (e) => {
        e.preventDefault();
        try {
            setError("");
            await api.post("/address/add",{
                ...form,
                userId,
            });
            navigate("/checkout");
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to save address");
        }
    }

    return(
        <div className="bg-slate-50 py-10">
            <div className="mx-auto w-full max-w-[900px] px-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Checkout</p>
                    <h1 className="mt-2 text-4xl font-black text-slate-900">Delivery Address</h1>

                    <form onSubmit={saveAddress} className="mt-8 grid gap-4 md:grid-cols-2">
                        {
                            Object.keys(form).map((key) => (
                                <input 
                                    key={key}
                                    name = {key}
                                    value={form[key]}
                                    placeholder={key}
                                    onChange={handleChange}
                                    className="h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
                                />
                            ))
                        }

                        {error && (
                            <p className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="md:col-span-2 mt-2 h-12 rounded-xl bg-teal-700 text-base font-bold text-white hover:bg-teal-800"
                        >
                            Save Address
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}