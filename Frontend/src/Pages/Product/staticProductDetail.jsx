import { useMemo, useState } from "react";
import { ArrowLeft, Check, Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { addStaticCartItem } from "../../services/staticCart.js";
import { getStaticProduct } from "../../services/staticStore.js";

export default function StaticProductDetail() {
 const { id } = useParams();
 const navigate = useNavigate();
 const product = useMemo(() => getStaticProduct(id), [id]);
 const [quantity, setQuantity] = useState(1);
 const [wishlisted, setWishlisted] = useState(() => JSON.parse(localStorage.getItem("wishlistIds") || "[]").includes(id));

 if (!product) return <main className="min-h-screen bg-surface px-6 py-20 text-center"><h1 className="text-3xl font-black">Product not found</h1><Link to="/" className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 font-black text-white">Back to shop</Link></main>;

 const addToCart = () => {
  for (let count = 0; count < quantity; count += 1) addStaticCartItem(product);
 };

 const toggleWishlist = () => {
  const current = JSON.parse(localStorage.getItem("wishlistIds") || "[]");
  const next = current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id];
  localStorage.setItem("wishlistIds", JSON.stringify(next));
  setWishlisted(next.includes(id));
 };

 return <main className="min-h-screen bg-surface py-8 text-ink"><div className="mx-auto max-w-[1180px] px-4 sm:px-6"><button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-accent"><ArrowLeft size={17} /> Back</button><div className="grid gap-8 rounded-[2rem] bg-card p-5 shadow-[0_20px_70px_rgba(103,76,58,0.08)] md:grid-cols-2 md:p-8"><div className="overflow-hidden rounded-[1.5rem] bg-card-soft"><img src={product.image} alt={product.title} className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full" /></div><section className="flex flex-col justify-center"><div className="flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">{product.category}</p><span className="flex items-center gap-1 text-sm font-bold text-ink-soft"><Star size={16} className="fill-[#f3ae62] text-[#f3ae62]" />{product.rating.toFixed(1)}</span></div><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{product.title}</h1><p className="mt-5 text-sm leading-7 text-ink-soft">{product.description}</p><p className="mt-7 text-4xl font-black">₹{product.price.toFixed(2)}</p><p className="mt-3 flex items-center gap-2 text-sm font-bold text-success"><Check size={17} /> In stock · {product.stock} available</p><div className="mt-7 flex flex-wrap items-center gap-4"><div className="flex h-12 items-center rounded-full border border-line-strong bg-card-soft"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-12 w-12 place-items-center" aria-label="Decrease quantity"><Minus size={17} /></button><span className="w-8 text-center font-black">{quantity}</span><button type="button" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} className="grid h-12 w-12 place-items-center" aria-label="Increase quantity"><Plus size={17} /></button></div><button type="button" onClick={addToCart} className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-black text-white hover:bg-accent-strong"><ShoppingBag size={17} /> Add to cart</button><button type="button" onClick={toggleWishlist} className="grid h-12 w-12 place-items-center rounded-full border border-line-strong text-accent" aria-label="Toggle wishlist"><Heart size={18} className={wishlisted ? "fill-[#e97855]" : ""} /></button></div><Link to="/cart" className="mt-6 text-sm font-black text-accent hover:text-accent-strong">View cart →</Link></section></div></div></main>;
}