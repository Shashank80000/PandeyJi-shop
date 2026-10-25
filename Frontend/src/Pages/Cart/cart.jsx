import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import api from "../../api/axios";
import { getCart, getCatalogue, publishCartUpdate } from "../../services/resourceCache.js";
import { getStaticCartItems, removeStaticCartItem, updateStaticCartItem } from "../../services/staticCart.js";

const getProductImage = (product) => product?.images?.find(Boolean) || product?.image || "";

function CartSkeleton() {
 return <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-4">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-card-soft" />)}</div><div className="h-80 animate-pulse rounded-2xl bg-card-soft" /></div>;
}

export default function Cart() {
 const userId = localStorage.getItem("userId");
 const navigate = useNavigate();
 const [cart, setCart] = useState(null);
 const [recommendations, setRecommendations] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [updatingId, setUpdatingId] = useState("");

 const loadCart = async () => {
  try {
   setLoading(true);
   setError("");
   const staticItems = getStaticCartItems().map((product) => ({
    productId: { _id: product.id, title: product.title, price: product.price, category: product.category, image: product.image, stock: product.stock },
    quantity: product.quantity,
    isStatic: true,
   }));
   if (!userId) {
    setCart({ items: staticItems });
    return;
   }
   const [cartResponse, productsResponse] = await Promise.all([
    getCart(userId),
    getCatalogue(),
   ]);
   setCart({ ...(cartResponse?.cart || {}), items: [...(cartResponse?.cart?.items || []), ...staticItems] });
   const products = Array.isArray(productsResponse) ? productsResponse : productsResponse?.products || [];
   setRecommendations(products);
  } catch (requestError) {
   if (requestError?.response?.status === 404) setCart({ items: [] });
   else {
    setCart({ items: [] });
    setError(requestError?.response?.data?.message || "Unable to load cart");
   }
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadCart();
  window.addEventListener("staticCartUpdated", loadCart);
  return () => window.removeEventListener("staticCartUpdated", loadCart);
 }, []);

 const safeItems = useMemo(() => (cart?.items || []).map((item) => {
  const product = item?.productId && typeof item.productId === "object" ? item.productId : null;
  return {
   ...item,
   productRefId: product?._id || (typeof item.productId === "string" ? item.productId : null),
   productTitle: product?.title || "Product unavailable",
   productImage: getProductImage(product),
   productPrice: Number(product?.price || 0),
   productStock: Number(product?.stock || 0),
   category: product?.category || "Product",
   quantity: Number(item?.quantity || 0),
   isStatic: Boolean(item?.isStatic),
  };
 }), [cart]);

 const total = safeItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
 const itemCount = safeItems.reduce((sum, item) => sum + item.quantity, 0);
 const hasStaticItems = safeItems.some((item) => item.isStatic);
 const hasBackendItems = safeItems.some((item) => !item.isStatic);
 const cartProductIds = new Set(safeItems.map((item) => item.productRefId));
 const suggestions = recommendations.filter((product) => !cartProductIds.has(product._id)).slice(0, 4);

 const removeItem = async (productId) => {
  const item = safeItems.find((entry) => entry.productRefId === productId);
  if (item?.isStatic) {
   removeStaticCartItem(productId);
   setCart((current) => ({ ...current, items: current.items.filter((entry) => (entry.productId?._id || entry.productId) !== productId) }));
   return;
  }
  try {
   setUpdatingId(productId);
   const response = await api.post("/cart/remove", { userId, productId });
   setCart((current) => ({ ...current, items: current.items.filter((item) => (item.productId?._id || item.productId) !== productId) }));
   publishCartUpdate(userId, response.data?.cart);
  } catch (requestError) {
   setError(requestError?.response?.data?.message || "Unable to remove item");
  } finally {
   setUpdatingId("");
  }
 };

 const updateQty = async (productId, quantity) => {
  if (quantity < 1) return removeItem(productId);
  const item = safeItems.find((entry) => entry.productRefId === productId);
  if (item?.productStock && quantity > item.productStock) return;

  if (item?.isStatic) {
   updateStaticCartItem(productId, quantity);
   setCart((current) => ({ ...current, items: current.items.map((entry) => (entry.productId?._id || entry.productId) === productId ? { ...entry, quantity } : entry) }));
   return;
  }

  setCart((current) => ({ ...current, items: current.items.map((entry) => (entry.productId?._id || entry.productId) === productId ? { ...entry, quantity } : entry) }));
  try {
   setUpdatingId(productId);
   const response = await api.post("/cart/update", { userId, productId, quantity });
   publishCartUpdate(userId, response.data?.cart);
  } catch (requestError) {
   setError(requestError?.response?.data?.message || "Unable to update quantity");
   loadCart();
  } finally {
   setUpdatingId("");
  }
 };

 return (
  <main className="min-h-screen bg-surface pb-20 text-ink">
   <div className="mx-auto max-w-[1220px] px-4 py-6 sm:px-6 lg:px-8">
    <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-ink-soft"><Link to="/" className="hover:text-accent">Home</Link><span>/</span><span className="text-ink">Cart</span></div>
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">Your selection</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Shopping cart</h1><p className="mt-2 text-sm text-ink-soft">{itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout.</p></div><Link to="/" className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-card px-4 py-2.5 text-sm font-bold text-ink-soft shadow-sm hover:border-[#e97855] hover:text-accent">Continue shopping <ArrowRight size={16} /></Link></div>

    {error && <div className="mb-5 rounded-xl bg-accent-soft p-4 text-sm font-semibold text-accent-ink">{error}</div>}
    {loading ? <CartSkeleton /> : safeItems.length === 0 ? <div className="rounded-[2rem] bg-card p-12 text-center shadow-[0_20px_70px_rgba(103,76,58,0.08)]"><ShoppingBag size={44} className="mx-auto text-accent" /><h2 className="mt-5 text-2xl font-black">Your cart is empty</h2><p className="mt-2 text-sm text-ink-soft">Find something beautiful for your next order.</p><Link to="/" className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-black text-white">Explore products</Link></div> : <>
     <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[2rem] bg-card p-4 shadow-[0_20px_70px_rgba(103,76,58,0.08)] sm:p-6"><div className="mb-4 flex items-center justify-between border-b border-line pb-4"><h2 className="text-xl font-black">Cart items</h2><span className="text-sm font-semibold text-ink-soft">{itemCount} total</span></div><div className="space-y-3">{safeItems.map((item) => <article key={item.productRefId} className="grid gap-4 rounded-2xl border border-line bg-page p-3 sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:items-center sm:p-4"><Link to={item.productRefId ? (item.isStatic ? `/static-product/${item.productRefId}` : `/product/${item.productRefId}`) : "/"} className="h-28 w-full overflow-hidden rounded-xl bg-card-soft sm:h-24 sm:w-24">{item.productImage ? <img src={item.productImage} alt={item.productTitle} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs text-ink-soft">No image</div>}</Link><div className="min-w-0"><p className="text-[11px] font-black uppercase tracking-[0.14em] text-accent-ink">{item.category}</p><Link to={item.productRefId ? (item.isStatic ? `/static-product/${item.productRefId}` : `/product/${item.productRefId}`) : "/"} className="mt-1 block truncate text-lg font-black text-ink hover:text-accent">{item.productTitle}</Link><p className="mt-1 text-sm text-ink-soft">₹{item.productPrice.toFixed(2)} each</p><div className="mt-3 flex items-center gap-3"><div className="flex h-9 items-center rounded-full border border-line-strong bg-card-soft"><button type="button" onClick={() => updateQty(item.productRefId, item.quantity - 1)} disabled={updatingId === item.productRefId} className="grid h-9 w-9 place-items-center text-ink-soft disabled:opacity-40" aria-label="Decrease quantity"><Minus size={14} /></button><span className="w-7 text-center text-sm font-black">{item.quantity}</span><button type="button" onClick={() => updateQty(item.productRefId, item.quantity + 1)} disabled={updatingId === item.productRefId || (item.productStock > 0 && item.quantity >= item.productStock)} className="grid h-9 w-9 place-items-center text-ink-soft disabled:opacity-40" aria-label="Increase quantity"><Plus size={14} /></button></div><button type="button" onClick={() => removeItem(item.productRefId)} disabled={updatingId === item.productRefId} className="flex items-center gap-1 text-xs font-bold text-accent-ink hover:text-[#8f3522] disabled:opacity-40"><Trash2 size={14} /> Remove</button></div></div><div className="flex items-center justify-between sm:block sm:text-right"><p className="text-xl font-black">₹{(item.productPrice * item.quantity).toFixed(2)}</p><button type="button" className="mt-2 hidden text-ink-faint sm:inline-flex" aria-label="Save item for later" title="Save for later"><Heart size={17} /></button></div></article>)}</div></section>

      <aside className="h-fit rounded-[2rem] bg-[#dceceb] p-6 shadow-[0_20px_70px_rgba(103,76,58,0.08)]"><h2 className="text-2xl font-black">Order summary</h2><div className="mt-6 space-y-3 border-b border-[#bcd3d1] pb-5 text-sm"><div className="flex justify-between"><span className="text-[#66817f]">Subtotal</span><span className="font-bold">₹{total.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-[#66817f]">Savings</span><span className="font-bold text-success">₹0.00</span></div><div className="flex justify-between"><span className="text-[#66817f]">Shipping</span><span className="font-bold text-success">Free</span></div></div><div className="flex items-center justify-between py-5"><span className="text-lg font-black">Total</span><span className="text-3xl font-black">₹{total.toFixed(2)}</span></div>{hasStaticItems ? <div className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent-ink">Static items are checked out as a guest COD order saved on this device.{hasBackendItems ? " Backend items stay in your cart and must be checked out separately." : ""}</div> : null}<button type="button" onClick={() => navigate("/checkout")} className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-black text-white transition hover:bg-accent-strong">{hasStaticItems ? "Checkout static items" : "Proceed to checkout"} <ArrowRight size={17} /></button><div className="mt-5 grid gap-3 text-xs font-semibold text-[#66817f]"><p className="flex items-center gap-2"><Truck size={16} /> Delivery options shown at checkout</p><p className="flex items-center gap-2"><ShieldCheck size={16} /> Secure checkout with your account</p><p className="flex items-center gap-2"><Check size={16} /> Existing checkout flow preserved</p></div></aside>
     </div>
     {suggestions.length > 0 && <section className="mt-12"><div className="mb-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">More to explore</p><h2 className="mt-1 text-3xl font-black">You may also like</h2></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{suggestions.map((product) => <Link key={product._id} to={`/product/${product._id}`} className="group overflow-hidden rounded-2xl bg-card shadow-sm"><div className="aspect-square overflow-hidden bg-card-soft">{getProductImage(product) ? <img src={getProductImage(product)} alt={product.title} className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="grid h-full place-items-center text-xs text-ink-soft">No image</div>}</div><div className="p-4"><p className="truncate text-sm font-black">{product.title}</p><p className="mt-2 font-bold text-accent">₹{Number(product.price || 0).toFixed(2)}</p></div></Link>)}</div></section>}
    </>}
   </div>
  </main>
 );
}
