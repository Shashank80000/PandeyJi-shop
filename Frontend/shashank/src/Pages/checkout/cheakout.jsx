import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router";

export default function Checkout() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load cart + addresses
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setCart({ items: [] });
          setAddresses([]);
          setSelectedAddress(null);
          return;
        }

        const [cartResponse, addressResponse] = await Promise.all([
          api.get(`/cart/${userId}`),
          api.get(`/address/${userId}`),
        ]);

        setCart(cartResponse.data?.cart || { items: [] });

        const addressList = Array.isArray(addressResponse.data)
          ? addressResponse.data
          : [];
        setAddresses(addressList);
        setSelectedAddress(addressList[0] || null);
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || "Unable to load checkout data");
        setCart({ items: [] });
        setAddresses([]);
        setSelectedAddress(null);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [userId]);

  if (loading) return <div className="mx-auto w-full max-w-[1200px] px-6 py-12 text-slate-600">Loading checkout...</div>;

  if (error) return <div className="mx-auto w-full max-w-[1200px] px-6 py-12 text-red-600">{error}</div>;

  if (!userId) return <div className="mx-auto w-full max-w-[1200px] px-6 py-12 text-slate-700">Please login to continue checkout.</div>;

  const items = Array.isArray(cart.items) ? cart.items : [];
  const safeItems = items.map((item) => ({
    ...item,
    productPrice:
      item?.productId && typeof item.productId === "object"
        ? Number(item.productId.price || 0)
        : 0,
    productTitle:
      item?.productId && typeof item.productId === "object"
        ? item.productId.title || "Product"
        : "Product",
  }));

  const total = safeItems.reduce(
    (sum, item) => sum + item.productPrice * Number(item.quantity || 0),
    0
  );

  // ✅ PLACE ORDER + CLEAR CART
  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    try {
      const res = await api.post("/orders/place", {
        userId,
        address: selectedAddress,
      });

      if (res?.data?.orderId) {
        navigate(`/order-success/${res.data.orderId}`, { replace: true });
        return;
      }

      navigate("/order-success", { replace: true });
    } catch (placeOrderError) {
      alert(placeOrderError?.response?.data?.message || "Unable to place order");
    }
  };

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <h1 className="text-4xl font-black text-slate-900">Checkout</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Select Delivery Address</h2>
              <button onClick={() => navigate("/checkout-address")} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Add New
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
                No address found. Please add an address to continue.
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className="block cursor-pointer rounded-xl border border-slate-200 p-4 transition hover:border-teal-300"
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === addr._id}
                      onChange={() => setSelectedAddress(addr)}
                      className="mr-2"
                    />
                    <strong className="text-slate-900">{addr.fullName}</strong>
                    <p className="mt-1 text-sm text-slate-600">
                      {addr.adressLine}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">Phone: {addr.phone}</p>
                  </label>
                ))}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Order Summary</h2>
            <div className="mt-4 max-h-64 space-y-2 overflow-auto pr-1">
              {safeItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <span className="max-w-[180px] truncate">{item.productTitle} x {item.quantity}</span>
                  <span>${(item.productPrice * Number(item.quantity || 0)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between text-lg font-black text-slate-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-base font-bold text-white hover:bg-emerald-700"
            >
              Place Order (COD)
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
