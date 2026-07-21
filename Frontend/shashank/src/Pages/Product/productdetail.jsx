import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = useMemo(() => {
    if (!product) return [];

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }

    if (product.image) return [product.image];

    return [];
  }, [product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await api.get("/products/");
      const products = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.products)
          ? res.data.products
          : [];

      const p = products.find((item) => item._id === id);
      setProduct(p || null);
      setCurrentIndex(0);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to load product");
      setProduct(null);
      setCurrentIndex(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    // If images change, keep index valid
    if (currentIndex > imageList.length - 1) {
      setCurrentIndex(0);
    }
  }, [imageList.length, currentIndex]);

  const goPrev = () => {
    if (imageList.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const goNext = () => {
    if (imageList.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageList.length]);

  const addToCart = async () => {
    if (!product) {
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      const res = await api.post("/cart/add", {
        userId,
        productId: product._id,
      });

      const itemCount = (res.data?.cart?.items || []).reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      localStorage.setItem("cartCount", String(itemCount));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to add item to cart");
    }
  };

  if (loading) {
    return <div className="mx-auto w-full max-w-[1200px] px-6 py-14 text-slate-600">Loading product details...</div>;
  }

  if (errorMessage) {
    return <div className="mx-auto w-full max-w-[1200px] px-6 py-14 text-red-600">{errorMessage}</div>;
  }

  if (!product) {
    return <div className="mx-auto w-full max-w-[1200px] px-6 py-14 text-slate-700">Product not found.</div>;
  }

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-6 lg:grid-cols-[1fr_460px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="rounded-2xl bg-slate-100 p-6">
            <div className="relative">
              <img
                src={imageList[currentIndex] || ""}
                alt={product.title}
                className="h-[460px] w-full object-contain"
              />

              {imageList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-bold text-slate-900 shadow hover:bg-white"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-bold text-slate-900 shadow hover:bg-white"
                  >
                    ›
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    {imageList.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Go to image ?{idx + 1}`}
                        className={
                          idx === currentIndex
                            ? "h-2.5 w-7 rounded-full bg-teal-700"
                            : "h-2.5 w-2.5 rounded-full bg-slate-300 hover:bg-slate-400"
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {imageList.length <= 1 && imageList.length === 0 && (
              <div className="flex h-[460px] items-center justify-center text-sm text-slate-500">No image available.</div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Product Detail</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-slate-900">{product.title}</h1>
          <p className="mt-4 text-base text-slate-600">{product.description}</p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Price</p>
            <p className="mt-1 text-4xl font-black text-slate-900">${Number(product.price || 0).toFixed(2)}</p>
          </div>

          <button
            onClick={addToCart}
            className="mt-8 w-full rounded-xl bg-teal-700 py-3 text-base font-bold text-white transition hover:bg-teal-800"
          >
            Add to Cart
          </button>
        </section>
      </div>
    </div>
  );
}

