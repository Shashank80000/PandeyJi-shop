import { useMemo, useRef, useState } from "react";
import { ArrowRight, Heart, ShoppingBag, Sparkles, Star, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { addStaticCartItem } from "../../services/staticCart.js";
import { STATIC_CATEGORIES, STATIC_PRODUCTS } from "../../services/staticStore.js";
function StaticProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart }) {
 return (
  <article className="group overflow-hidden rounded-[1.35rem] border border-line bg-card shadow-[0_10px_30px_rgba(111,78,55,0.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(0,0,0,0.2)]">
   <Link to={`/static-product/${product.id}`} className="block" aria-label={`View ${product.title}`}>
    <div className="relative aspect-[1.05/1] overflow-hidden bg-card-soft">
     <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
     <span className="absolute left-3 top-3 rounded-full bg-[#ef7d57] px-3 py-1 text-xs font-bold text-white">{product.badge}</span>
     <button type="button" onClick={() => onToggleWishlist(product.id)} aria-label={`${isWishlisted ? "Remove" : "Save"} ${product.title}`} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-accent shadow-sm transition hover:bg-card">
      <Heart size={17} strokeWidth={2.2} className={isWishlisted ? "fill-[#e97855]" : ""} />
     </button>
    </div>
   </Link>
   <div className="p-4">
    <div className="mb-2 flex items-center justify-between gap-2"><span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-ink">{product.category}</span><span className="flex items-center gap-1 text-xs font-semibold text-ink-soft"><Star size={13} className="fill-[#f3ae62] text-[#f3ae62]" />{product.rating.toFixed(1)}</span></div>
    <h3 className="min-h-12 text-lg font-bold leading-tight text-ink"><Link to={`/static-product/${product.id}`} className="hover:text-accent">{product.title}</Link></h3>
    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-soft">{product.description}</p>
    <div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-xl font-black text-ink">₹{product.price.toFixed(2)}</p>{product.stock <= 5 && <p className="mt-1 text-xs font-semibold text-accent-ink">Only {product.stock} left</p>}</div><button type="button" onClick={() => onAddToCart(product)} className="grid h-10 w-10 place-items-center rounded-full bg-accent text-white transition hover:bg-accent-strong" aria-label={`Add ${product.title} to cart`}><ShoppingBag size={17} /></button></div>
   </div>
  </article>
 );
}

export default function Home() {
 const [category, setCategory] = useState("");
 const [toast, setToast] = useState("");
 const toastTimer = useRef(null);
 const [wishlistIds, setWishlistIds] = useState(() => JSON.parse(localStorage.getItem("wishlistIds") || "[]"));

 const products = useMemo(() => category ? STATIC_PRODUCTS.filter((product) => product.category === category) : STATIC_PRODUCTS, [category]);
 const heroProduct = STATIC_PRODUCTS[0];

 const toggleWishlist = (productId) => {
  setWishlistIds((current) => {
   const next = current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId];
   localStorage.setItem("wishlistIds", JSON.stringify(next));
   return next;
  });
 };

 const addToCart = (product) => {
  addStaticCartItem(product);
  setToast(`${product.title} added to cart`);
  window.clearTimeout(toastTimer.current);
  toastTimer.current = window.setTimeout(() => setToast(""), 2200);
 };

 return (
  <main className="min-h-[calc(100vh-80px)] bg-page py-6 sm:py-8">
   <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8">
    <div className="grid gap-6 lg:grid-cols-[264px_minmax(0,1fr)]">
     <aside className="hidden rounded-2xl bg-chip p-5 lg:block"><div className="mb-5 flex items-center justify-between"><h2 className="font-black">Categories</h2><Tag size={17} className="text-accent" /></div><button type="button" onClick={() => setCategory("")} className={`mb-2 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold ${!category ? "bg-card text-accent shadow-sm" : "text-ink-soft hover:bg-card/70"}`}>All products<ArrowRight size={15} /></button>{STATIC_CATEGORIES.map((item) => <button key={item.name} type="button" onClick={() => setCategory(item.name)} className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${category === item.name ? "bg-card text-accent shadow-sm" : "text-ink-soft hover:bg-card/70"}`}>{item.name}<ArrowRight size={15} /></button>)}</aside>

     <div className="min-w-0">
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">{["", ...STATIC_CATEGORIES.map((item) => item.name)].map((item) => <button key={item || "all"} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${category === item ? "bg-accent text-white" : "bg-chip text-ink-soft"}`}>{item || "All"}</button>)}</div>
      <section className="grid min-h-[340px] overflow-hidden rounded-[1.6rem] bg-overlay md:grid-cols-[1fr_0.8fr]"><div className="flex flex-col justify-center p-7 sm:p-10"><p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-accent-ink dark:text-[#f2a186]"><Sparkles size={15} /> From our collection</p><h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-ink dark:text-[#f7ece5] sm:text-5xl">{heroProduct.title}</h1><p className="mt-4 max-w-md text-sm leading-6 text-[#765c4e] dark:text-[#d3b8ab]">{heroProduct.description}</p><div className="mt-6 flex flex-wrap items-center gap-4"><button type="button" onClick={() => setCategory(heroProduct.category)} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-black text-white hover:bg-accent-strong">Explore collection <ArrowRight size={16} /></button><span className="text-xl font-black text-ink dark:text-[#f7ece5]">₹{heroProduct.price.toFixed(2)}</span></div></div><div className="relative min-h-[260px] bg-[#b9d8d7] dark:bg-[#20403f]"><img src={heroProduct.image} alt={heroProduct.title} className="h-full w-full object-cover" /><span className="absolute right-5 top-5 rounded-full bg-card/80 px-3 py-1 text-xs font-black uppercase tracking-wider text-accent-ink">{heroProduct.category}</span></div></section>
     </div>
    </div>

    <section className="mt-12"><div className="mb-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">Browse the collection</p><h2 className="mt-1 text-3xl font-black">Explore Categories</h2></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{STATIC_CATEGORIES.map((item) => <button type="button" key={item.name} onClick={() => setCategory(item.name)} className="group relative min-h-32 overflow-hidden rounded-2xl bg-card-soft text-left"><img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#2f2926]/75 to-transparent" /><span className="absolute bottom-3 left-3 text-sm font-black text-white">{item.name}</span></button>)}</div></section>

    <section className="mt-12"><div className="mb-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">Static homepage collection</p><h2 className="mt-1 text-3xl font-black">{category ? `${category} Products` : "Featured Products"}</h2></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <StaticProductCard key={product.id} product={product} isWishlisted={wishlistIds.includes(product.id)} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} />)}</div></section>

    {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-page shadow-lg">{toast}</div>}
   </div>
  </main>
 );
}