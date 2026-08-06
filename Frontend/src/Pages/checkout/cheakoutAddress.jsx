import { useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router";

export default function CheckoutAddress() {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        adressLine: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveAddress = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError("Please login to add an address.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await api.post("/address/add", {
                ...form,
                userId
            });

            // After saving, go back to checkout
            navigate("/checkout");

        } catch (err) {
            console.error("Save address error:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to save address"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="mx-auto w-full max-w-[900px] px-6">

                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                        Checkout
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-slate-900">
                        Add Delivery Address
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Enter your delivery details below.
                    </p>

                    <form
                        onSubmit={saveAddress}
                        className="mt-8 grid gap-5 md:grid-cols-2"
                    >

                        {/* Full Name */}
                        <div>
                            <label className="mb-2 block font-semibold text-slate-700">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block font-semibold text-slate-700">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600"
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block font-semibold text-slate-700">
                                Address
                            </label>

                            <input
                                type="text"
                                name="adressLine"
                                value={form.adressLine}
                                onChange={handleChange}
                                placeholder="House no, street, area"
                                required
                                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="mb-2 block font-semibold text-slate-700">
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="Enter city"
                                required
                                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600"
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="mb-2 block font-semibold text-slate-700">
                                State
                            </label>

                            <input
                                type="text"
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                placeholder="Enter state"
                                required
                                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600"
                            />
                        </div>

                        {/* Pincode */}
                        <div>
                            <label className="mb-2 block font-semibold text-slate-700">
                                Pincode
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                placeholder="Enter pincode"
                                required
                                className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                                {error}
                            </p>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 md:col-span-2">

                            <button
                                type="button"
                                onClick={() => navigate("/checkout")}
                                className="h-12 rounded-xl border border-slate-300 px-6 font-bold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="h-12 rounded-xl bg-teal-700 px-6 font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Address"}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}