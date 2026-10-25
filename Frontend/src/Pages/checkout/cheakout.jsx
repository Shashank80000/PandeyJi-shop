import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router";
import { clearStaticCart, getStaticCartItems } from "../../services/staticCart.js";
import { createStaticOrder, getStaticAddresses } from "../../services/staticStore.js";
import { getAddresses, getCart, publishCartUpdate } from "../../services/resourceCache.js";

export default function Checkout() {
 const navigate = useNavigate();
 const userId = localStorage.getItem("userId");
 const [staticItems, setStaticItems] = useState(() => getStaticCartItems());
 const [backendCart, setBackendCart] = useState({ items: [] });
 const [addresses, setAddresses] = useState([]);
 const [selectedAddress, setSelectedAddress] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const isStaticCheckout = staticItems.length > 0;

 useEffect(() => {
  const loadCheckout = async () => {
   try {
    setLoading(true);
    setError("");
    const localItems = getStaticCartItems();
    setStaticItems(localItems);
    if (localItems.length > 0) {
     const localAddresses = getStaticAddresses();
     setAddresses(localAddresses);
     setSelectedAddress(localAddresses[0] || null);
     return;
    }
    if (!userId) return;
    const [cartResponse, addressResponse] = await Promise.all([getCart(userId), getAddresses(userId)]);
    setBackendCart(cartResponse?.cart || { items: [] });
    const addressList = Array.isArray(addressResponse) ? addressResponse : addressResponse?.addresses || [];
    setAddresses(addressList);
    setSelectedAddress(addressList[0] || null);
   } catch (requestError) {
    setError(requestError?.response?.data?.message || "Unable to load checkout data");
   } finally {
    setLoading(false);
   }
  };
  loadCheckout();
 }, [userId]);

 const items = useMemo(() => isStaticCheckout
  ? staticItems.map((item) => ({ ...item, productTitle: item.title, productPrice: Number(item.price || 0), quantity: Number(item.quantity || 0) }))
  : (backendCart.items || []).map((item) => ({ ...item, productTitle: item.productId?.title || "Product", productPrice: Number(item.productId?.price || 0), quantity: Number(item.quantity || 0) })), [backendCart, isStaticCheckout, staticItems]);
 const total = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

 const placeOrder = async () => {
  if (!selectedAddress) return setError("Please add and select a delivery address.");
  if (items.length === 0) return setError("Your cart is empty.");
  try {
   if (isStaticCheckout) {
    const order = createStaticOrder({ items, address: selectedAddress, total });
    clearStaticCart();
    navigate(`/order-success/${order._id}`, { replace: true });
    return;
   }
   const response = await api.post("/orders/place", { userId, address: selectedAddress });
   publishCartUpdate(userId, { items: [] });
   navigate(`/order-success/${response.data?.orderId || "complete"}`, { replace: true });
  } catch (requestError) {
   setError(requestError?.response?.data?.message || "Unable to place order");
  }
 };

 if (loading) return <div className="mx-auto max-w-[1200px] px-6 py-12 text-ink-soft">Loading checkout...</div>;
 if (!isStaticCheckout && !userId) return <div className="mx-auto max-w-[1200px] px-6 py-12 text-ink">Please log in to check out backend products.</div>;

 return <main className="min-h-screen bg-surface py-10"><div className="mx-auto w-full max-w-[1200px] px-6"><div className="mb-6"><p className="text-sm font-bold uppercase tracking-[0.18em] text-accent-strong">{isStaticCheckout ? "Local static checkout" : "Checkout"}</p><h1 className="mt-2 text-4xl font-black text-ink">Checkout</h1></div>{error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}<div className="grid gap-6 lg:grid-cols-[1fr_360px]"><section className="rounded-2xl border border-line bg-card p-6 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Select Delivery Address</h2><button type="button" onClick={() => navigate("/checkout-address")} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold">Add New</button></div>{addresses.length === 0 ? <div className="rounded-xl border border-dashed p-6"><p>No delivery address found.</p><button type="button" onClick={() => navigate("/checkout-address")} className="mt-4 rounded-xl bg-accent-strong px-5 py-3 font-bold text-white">Add Delivery Address</button></div> : <div className="space-y-3">{addresses.map((address) => <label key={address._id} className="block cursor-pointer rounded-xl border p-4"><input type="radio" checked={selectedAddress?._id === address._id} onChange={() => setSelectedAddress(address)} className="mr-2" /><strong>{address.fullName}</strong><p className="mt-1 text-sm text-ink-soft">{address.adressLine || address.addressLine}, {address.city}, {address.state} - {address.pincode}</p><p className="text-sm text-ink-soft">Phone: {address.phone}</p></label>)}</div>}</section><aside className="h-fit rounded-2xl border border-line bg-card p-6 shadow-sm"><h2 className="text-xl font-black">Order Summary</h2><div className="mt-4 space-y-2">{items.map((item) => <div key={item.id || item._id || item.productId?._id} className="flex justify-between rounded-lg bg-surface px-3 py-2 text-sm"><span>{item.productTitle} × {item.quantity}</span><span>₹{(item.productPrice * item.quantity).toFixed(2)}</span></div>)}</div><div className="mt-4 flex justify-between border-t pt-4 text-lg font-black"><span>Total</span><span>₹{total.toFixed(2)}</span></div><button type="button" onClick={placeOrder} className="mt-6 w-full rounded-xl bg-accent-strong py-3 font-bold text-white hover:bg-accent-strong">Place Order (COD)</button></aside></div></div></main>;
}