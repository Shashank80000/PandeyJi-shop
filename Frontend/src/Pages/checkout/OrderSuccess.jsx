import { useNavigate, useParams } from "react-router";
import { getStaticOrders } from "../../services/staticStore.js";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const staticOrder = getStaticOrders().find((order) => order._id === id);

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-surface py-16">
      <div className="mx-auto w-full max-w-[760px] px-6">
        <div className="rounded-3xl border border-emerald-200 bg-card p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
            ✓
          </div>
          <h1 className="mt-6 text-4xl font-black text-emerald-700">Order placed successfully</h1>

          <p className="mt-4 text-ink-soft">
            {id ? (
              <>Your Order ID: <span className="font-bold text-ink">{id}</span></>
            ) : (
              <>Your order has been placed successfully.</>
            )}
          </p>
          {staticOrder && <div className="mt-6 rounded-2xl bg-surface p-5 text-left text-sm text-ink"><div className="flex justify-between border-b border-line pb-3"><span className="font-bold">Local COD total</span><span className="font-black">₹{Number(staticOrder.totalAmount || 0).toFixed(2)}</span></div><div className="mt-3 space-y-2">{staticOrder.items.map((item) => <div key={item.id || item.productRefId} className="flex justify-between"><span>{item.productTitle || item.title} × {item.quantity}</span><span>₹{(Number(item.productPrice ?? item.price ?? 0) * Number(item.quantity || 0)).toFixed(2)}</span></div>)}</div><p className="mt-4 border-t border-line pt-3"><span className="font-bold">Deliver to: </span>{staticOrder.address.fullName}, {staticOrder.address.adressLine || staticOrder.address.addressLine}, {staticOrder.address.city}, {staticOrder.address.state} - {staticOrder.address.pincode}</p></div>}

          <button
            onClick={goHome}
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-accent-strong px-8 py-3 text-sm font-bold text-white hover:bg-accent-strong"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}