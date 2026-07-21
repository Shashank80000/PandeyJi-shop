import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router";


export default function Cart() {
    const userId = localStorage.getItem("userId");
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    //Load cart data
    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");

            if (!userId) {
                setCart({ items: [] });
                return;
            }

            const res = await api.get(`/cart/${userId}`);
            setCart(res.data?.cart || { items: [] });
        } catch (e) {
            if (e?.response?.status === 404) {
                setCart({ items: [] });
            } else {
                setError(e?.response?.data?.message || "Unable to load cart");
                setCart({ items: [] });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const removeItem = async (productId) => {
        await api.post(`/cart/remove`, { userId, productId });
        loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
    };

    //Update item quantity
    const updateQty = async (productId, quantity) => {
        if (quantity === 0) {
            await removeItem(productId);
            return;
        }

        await api.post(`/cart/update`, { userId, productId, quantity });
        loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
    };

    if (loading) {
        return <div className="mx-auto w-full max-w-[1200px] px-6 py-12 text-slate-600">Loading cart...</div>;
    }

    if (error) {
        return <div className="mx-auto w-full max-w-[1200px] px-6 py-12 text-red-600">{error}</div>;
    }

    if (!userId) {
        return <div className="mx-auto w-full max-w-[1200px] px-6 py-12 text-slate-700">Please login to view your cart.</div>;
    }

    const items = cart?.items || [];
    const safeItems = items.map((item) => {
        const product =
            item?.productId && typeof item.productId === "object"
                ? item.productId
                : null;

        return {
            ...item,
            productRefId:
                product?._id ||
                (typeof item?.productId === "string" ? item.productId : null),
            productTitle: product?.title || "Product unavailable",
            productImage: product?.image || "",
            productPrice: Number(product?.price || 0),
        };
    });

    const total = safeItems.reduce(
        (sum, item) => sum + item.productPrice * Number(item.quantity || 0),
        0
    );

    return (
        <div className="bg-slate-50 py-10">
            <div className="mx-auto w-full max-w-[1200px] px-6">
                <h1 className="text-4xl font-black text-slate-900">Your Cart</h1>

                {safeItems.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600 shadow-sm">
                        Your cart is empty.
                    </div>
                ) : (
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-4">
                            {safeItems.map((item, index) => (
                                <div
                                    key={item.productRefId || index}
                                    className="grid items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto_auto_auto]"
                                >
                                    <div className="flex items-center gap-4">
                                        {item.productImage ? (
                                            <img
                                                src={item.productImage}
                                                alt={item.productTitle}
                                                className="h-20 w-20 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-200 text-xs text-slate-600">
                                                No image
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                {item.productTitle}
                                            </h2>
                                            <p className="text-sm text-slate-500">
                                                ₹{item.productPrice.toFixed(2)} each
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                                        <button
                                            onClick={() => updateQty(item.productRefId, item.quantity - 1)}
                                            disabled={!item.productRefId}
                                            className="h-8 w-8 rounded-md bg-white text-lg font-bold text-slate-700 shadow-sm disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQty(item.productRefId, item.quantity + 1)}
                                            disabled={!item.productRefId}
                                            className="h-8 w-8 rounded-md bg-white text-lg font-bold text-slate-700 shadow-sm disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="text-lg font-black text-slate-900">
                                        ₹{(item.productPrice * item.quantity).toFixed(2)}
                                    </p>

                                    <button
                                        onClick={() => removeItem(item.productRefId)}
                                        disabled={!item.productRefId}
                                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900">Order Summary</h2>
                            <div className="mt-4 border-t border-slate-200 pt-4">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-lg font-black text-slate-900">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate("/checkout-address")} className="mt-6 w-full rounded-xl bg-teal-700 py-3 font-bold text-white transition hover:bg-teal-800">
                                Proceed to Checkout
                            </button>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
