import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Heart, Share2, ShoppingBag, Star } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../../api/axios";
import { getCatalogue, getCart, publishCartUpdate } from "../../services/resourceCache.js";
import { STATIC_PRODUCTS, getStaticProduct, isStaticProductId } from "../../services/staticStore.js";
import { addStaticCartItem } from "../../services/staticCart.js";
import ProductCard from "../../Component/ProductCard/ProductCard.jsx";

const getImage = (product) => product?.images?.find(Boolean) || product?.image || "";

const getDiscount = (product) => {
 const discount = Number(product?.discount ?? product?.discountPercentage);
 if (Number.isFinite(discount) && discount > 0) return discount;

 const originalPrice = Number(product?.originalPrice ?? product?.mrp);
 const price = Number(product?.price);
 return originalPrice > price && price >= 0
  ? Math.round(((originalPrice - price) / originalPrice) * 100)
  : 0;
};

const getRating = (product) => Number(product?.rating ?? product?.averageRating ?? 0);

function ProductSkeleton() {
 return (
  <div className="mx-auto max-w-[1220px] animate-pulse rounded-[2rem] bg-card p-5 shadow-sm sm:p-8 lg:p-10">
   <div className="grid gap-10 lg:grid-cols-2"><div className="h-[520px] rounded-[1.5rem] bg-card-soft" /><div className="space-y-5"><div className="h-4 w-32 rounded bg-card-soft" /><div className="h-14 w-4/5 rounded bg-card-soft" /><div className="h-24 rounded bg-card-soft" /><div className="h-16 rounded bg-card-soft" /><div className="h-14 rounded bg-card-soft" /></div></div>
  </div>
 );
}

function Accordion({ title, children, defaultOpen = false }) {
 const [open, setOpen] = useState(defaultOpen);
 return (
  <div className="border-b border-line last:border-b-0">
   <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between py-5 text-left text-base font-black text-ink">
    {title}<ChevronDown size={18} className={`text-accent transition ${open ? "rotate-180" : ""}`} />
   </button>
   {open && <div className="pb-5 text-sm leading-7 text-ink-soft">{children}</div>}
  </div>
 );
}

export default function ProductDetails() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [product, setProduct] = useState(null);
 const [allProducts, setAllProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [errorMessage, setErrorMessage] = useState("");
 const [currentIndex, setCurrentIndex] = useState(0);
 const [quantity, setQuantity] = useState(1);
 const [adding, setAdding] = useState(false);
 const [copied, setCopied] = useState(false);

 useEffect(() => {
  const controller = new AbortController();
  let active = true;

  // Static homepage products live entirely in localStorage.
  if (isStaticProductId(id)) {
   const staticProduct = getStaticProduct(id);
   setProduct(staticProduct);
   setAllProducts(staticProduct ? STATIC_PRODUCTS.filter((item) => item.id !== staticProduct.id) : []);
   setCurrentIndex(0);
   setQuantity(1);
   setLoading(false);
   return () => { active = false; };
  }

  const loadProduct = async () => {
   try {
    setLoading(true);
    setErrorMessage("");
    const data = await getCatalogue({}, { signal: controller.signal });
    if (!active) return;
    const products = Array.isArray(data) ? data : data?.products || [];
    const currentProduct = products.find((item) => String(item._id) === String(id)) || null;
    setAllProducts(products);
    setProduct(currentProduct || null);
    setCurrentIndex(0);
    setQuantity(1);
   } catch (error) {
    if (!active || error?.name === "AbortError" || error?.name === "CanceledError") return;
    setErrorMessage(error.response?.data?.message || "Unable to load product");
    // Keep any previously loaded product visible if a revalidation fails.
   } finally {
    if (active) setLoading(false);
   }
  };

  loadProduct();
  return () => {
   active = false;
   controller.abort();
  };
 }, [id]);

 const imageList = useMemo(() => {
  if (!product) return [];
  if (Array.isArray(product.images)) return product.images.filter(Boolean);
  return product.image ? [product.image] : [];
 }, [product]);

 const relatedProducts = useMemo(() => {
  if (!product) return [];
  return allProducts
   .filter((item) => item._id !== product._id && item.category && item.category === product.category)
   .slice(0, 4);
 }, [allProducts, product]);

 const stock = Math.max(0, Number(product?.stock || 0));
 const discount = getDiscount(product);
 const rating = getRating(product);
 const originalPrice = Number(product?.originalPrice ?? product?.mrp ?? 0);
 const inStock = stock > 0;

 const changeQuantity = (amount) => {
  setQuantity((current) => Math.min(stock || 1, Math.max(1, current + amount)));
 };

 const isStatic = isStaticProductId(id);

 const addToCart = async () => {
  if (!product || !inStock) return;

  if (isStatic) {
   addStaticCartItem(product);
   navigate("/cart");
   return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
   alert("Please login first");
   return;
  }

  try {
   setAdding(true);
   const existingCart = await getCart(userId);
   const existingItem = (existingCart?.cart?.items || []).find((item) => {
    const productId = item.productId?._id || item.productId;
    return productId?.toString() === product._id.toString();
   });
   const nextQuantity = Math.min(Number(existingItem?.quantity || 0) + quantity, stock);

   let response;
   if (existingItem) {
    response = await api.post("/cart/update", { userId, productId: product._id, quantity: nextQuantity });
   } else {
    response = await api.post("/cart/add", { userId, productId: product._id });
    if (quantity > 1) {
     response = await api.post("/cart/update", { userId, productId: product._id, quantity });
    }
   }

   const itemCount = (response.data?.cart?.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
   localStorage.setItem("cartCount", String(itemCount));
   publishCartUpdate(userId, response.data?.cart);
  } catch (error) {
   alert(error.response?.data?.message || "Unable to add item to cart");
  } finally {
   setAdding(false);
  }
 };

 const shareProduct = async () => {
  const shareData = { title: product.title, text: product.description || product.title, url: window.location.href };
  try {
   if (navigator.share) await navigator.share(shareData);
   else {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
   }
  } catch {
   setCopied(false);
  }
 };

 if (loading) return <main className="min-h-screen bg-surface px-4 py-8"><ProductSkeleton /></main>;
 if (errorMessage) return <main className="min-h-screen bg-surface px-6 py-20 text-center"><p className="text-accent-ink">{errorMessage}</p><Link to="/" className="mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-black text-white">Continue Shopping</Link></main>;
 if (!product) return <main className="min-h-screen bg-surface px-6 py-20 text-center"><h1 className="text-3xl font-black text-ink">Product not found</h1><Link to="/" className="mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-black text-white">Continue Shopping</Link></main>;

 return (
  <main className="min-h-screen bg-surface pb-20 text-ink">
   <div className="mx-auto max-w-[1220px] px-4 py-6 sm:px-6 lg:px-8">
    <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-ink-soft hover:text-accent"><ArrowLeft size={16} /> Back to shop</Link>
    <div className="rounded-[2rem] bg-card p-5 shadow-[0_20px_70px_rgba(103,76,58,0.08)] sm:p-8 lg:p-10">
     <div className="grid gap-10 lg:grid-cols-2">
      <section>
       <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#b9d8d7] p-8 sm:min-h-[520px]">
        {imageList.length > 0 ? <img src={imageList[currentIndex]} alt={product.title} className="max-h-[470px] w-full object-contain mix-blend-multiply" /> : <p className="text-sm text-ink-soft">No image available</p>}
        {discount > 0 && <span className="absolute left-5 top-5 rounded-full bg-accent px-4 py-2 text-xs font-black text-white">-{discount}%</span>}
        {imageList.length > 1 && <><button type="button" onClick={() => setCurrentIndex((currentIndex - 1 + imageList.length) % imageList.length)} className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-ink-soft shadow" aria-label="Previous image"><ArrowLeft size={17} /></button><button type="button" onClick={() => setCurrentIndex((currentIndex + 1) % imageList.length)} className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-ink-soft shadow" aria-label="Next image"><ArrowRight size={17} /></button></>}
       </div>
       {imageList.length > 0 && <div className="mt-4 flex gap-3 overflow-x-auto pb-1">{imageList.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setCurrentIndex(index)} className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-card-soft p-1 ${currentIndex === index ? "border-[#e97855]" : "border-transparent"}`} aria-label={`View image ${index + 1}`}><img src={image} alt="" className="h-full w-full object-contain" /></button>)}</div>}
      </section>

      <section className="flex flex-col justify-center">
       <div className="flex items-center justify-between gap-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">{product.category || "Product"}</p><button type="button" onClick={shareProduct} className="flex items-center gap-2 rounded-full border border-line-strong px-3 py-2 text-xs font-bold text-ink-soft hover:border-[#e97855] hover:text-accent"><Share2 size={14} />{copied ? "Copied" : "Share"}</button></div>
       <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight text-ink sm:text-5xl">{product.title}</h1>
       {rating > 0 && <div className="mt-4 flex items-center gap-2 text-sm font-bold text-ink-soft"><span className="flex gap-0.5 text-[#f0a65c]">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} className={index < Math.round(rating) ? "fill-current" : ""} />)}</span>{rating.toFixed(1)}{product.reviewCount ? ` (${product.reviewCount} reviews)` : ""}</div>}
       <p className="mt-5 text-base leading-7 text-ink-soft">{product.description || "No description available for this product."}</p>
       <div className="mt-7 flex items-end gap-3"><span className="text-4xl font-black text-ink">₹{Number(product.price || 0).toFixed(2)}</span>{discount > 0 && originalPrice > 0 && <span className="pb-1 text-base text-ink-faint line-through">₹{originalPrice.toFixed(2)}</span>}</div>
       <div className="mt-3 flex items-center gap-2 text-sm font-bold">{inStock ? <><Check size={17} className="text-success" /> In stock{stock <= 5 && <span className="text-accent-ink">· Only {stock} left</span>}</> : <span className="text-accent-ink">Out of stock</span>}</div>
       <div className="mt-7 flex flex-wrap items-center gap-4"><div className="flex h-12 items-center rounded-full border border-line-strong bg-card-soft"><button type="button" onClick={() => changeQuantity(-1)} disabled={!inStock || quantity <= 1} className="grid h-12 w-12 place-items-center text-lg font-bold text-ink-soft disabled:opacity-40" aria-label="Decrease quantity">−</button><span className="w-8 text-center text-sm font-black">{quantity}</span><button type="button" onClick={() => changeQuantity(1)} disabled={!inStock || quantity >= stock} className="grid h-12 w-12 place-items-center text-lg font-bold text-ink-soft disabled:opacity-40" aria-label="Increase quantity">+</button></div><button type="button" onClick={addToCart} disabled={!inStock || adding} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-black text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-[#d7c7bf] sm:flex-none"><ShoppingBag size={17} />{adding ? "Adding..." : "Add to cart"}</button></div>
       <button type="button" disabled className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-ink-faint" title="Wishlist is not available in this backend yet"><Heart size={17} /> Wishlist unavailable</button>
      </section>
     </div>

     <div className="mt-12 grid gap-8 border-t border-line pt-3 lg:grid-cols-[1fr_0.8fr]">
      <div><Accordion title="Product Details" defaultOpen><dl className="grid gap-3 sm:grid-cols-2"><div><dt className="font-bold text-ink">Category</dt><dd>{product.category || "Not specified"}</dd></div><div><dt className="font-bold text-ink">Stock</dt><dd>{stock} available</dd></div><div><dt className="font-bold text-ink">Product ID</dt><dd className="break-all">{product._id || product.id}</dd></div></dl></Accordion><Accordion title="Additional Information">{product.description ? <p>{product.description}</p> : <p>No additional product information is available.</p>}</Accordion></div>
      <div><Accordion title="Shipping & Returns" defaultOpen><p>Shipping and return information is not provided by the current product data. Please refer to the existing Shipping Policy and Return Policy in the site footer.</p></Accordion></div>
     </div>
    </div>

    {relatedProducts.length > 0 && <section className="mt-14"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-accent">You may also like</p><h2 className="mt-1 text-3xl font-black">Related Products</h2></div><Link to={`/?category=${encodeURIComponent(product.category || "")}`} className="hidden items-center gap-2 text-sm font-bold text-accent sm:flex">View collection <ArrowRight size={16} /></Link></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{relatedProducts.map((item) => <ProductCard key={item.id || item._id} product={item} staticMode={Boolean(item.id && isStaticProductId(item.id))} onAddToCart={async (productId) => {
       const staticProduct = getStaticProduct(productId);
       if (staticProduct) {
        addStaticCartItem(staticProduct);
        return;
       }
       const userId = localStorage.getItem("userId");
       if (!userId) return alert("Please login first");
       const response = await api.post("/cart/add", { userId, productId });
       publishCartUpdate(userId, response.data?.cart);
      }} />)}</div></section>}
   </div>
  </main>
 );
}
