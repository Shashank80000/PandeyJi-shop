import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate, useSearchParams } from "react-router";
import ShapeGrid from "../../Component/ShapeGrid/ShapeGrid";
import ProductCard from "../../Component/ProductCard/ProductCard.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [category, setCategory] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadProducts = async () => {
    try {
      const res = await api.get(`/products?search=${search}&category=${category}`);

      if (search) {
        setProducts(res.data.products || []);
        setSimilarProducts(res.data.similarProducts || []);
      } else {
        const productList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products)
            ? res.data.products
            : [];

        setProducts(productList);
        setSimilarProducts([]);
      }

      setLoadError("");
    } catch (error) {
      setProducts([]);
      setLoadError(
        error?.response?.data?.message ||
        "Unable to load products right now. Please try again."
      );
      console.error("Failed to load products", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const res = await api.post(`/cart/add`, { userId, productId });
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


       const [showPromotion, setShowPromotion] = useState(true);

const [timeLeft, setTimeLeft] = useState({
  days: 4,
  hours: 6,
  minutes: 42,
  seconds: 0,
});

useEffect(() => {
  // 4 days, 6 hours, 42 minutes from now
  const endTime =
    Date.now() +
    (4 * 24 * 60 * 60 * 1000) +
    (6 * 60 * 60 * 1000) +
    (42 * 60 * 1000);

  const timer = setInterval(() => {
    const difference = endTime - Date.now();

    if (difference <= 0) {
      clearInterval(timer);

      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });

      return;
    }

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),

      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      ),

      minutes: Math.floor(
        (difference / (1000 * 60)) % 60
      ),

      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);




  return (
    <div className="bg-slate-50 pb-12">

      {/* Last time offer */}

     {showPromotion && (
  <div
    role="region"
    aria-label="Promotion"
    className="relative flex items-center justify-center bg-blue-700 px-4 py-2.5 text-center md:px-6"
  >
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pr-8">

      <p className="text-sm font-medium text-white">
        Limited time offer -
      </p>

      {/* TIMER */}
      <div className="flex items-center gap-3">

        {/* DAYS */}
        <div className="flex items-center gap-1">
          <span className="mx-1 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold leading-tight text-slate-900">
            {String(timeLeft.days).padStart(2, "0")}
          </span>

          <span className="text-xs text-slate-50">
            DAYS
          </span>
        </div>

        {/* HOURS */}
        <div className="flex items-center gap-1">
          <span className="mx-1 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold leading-tight text-slate-900">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>

          <span className="text-xs text-slate-50">
            HRS
          </span>
        </div>

        {/* MINUTES */}
        <div className="flex items-center gap-1">
          <span className="mx-1 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold leading-tight text-slate-900">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>

          <span className="text-xs text-slate-50">
            MIN
          </span>
        </div>

        {/* SECONDS */}
        <div className="flex items-center gap-1">
          <span className="mx-1 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold leading-tight text-slate-900">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>

          <span className="text-xs text-slate-50">
            SEC
          </span>
        </div>

      </div>

      {/* COUPON */}
      <span className="text-sm text-white">
        Use code -
        <span className="ml-1 font-bold text-white">
          SAVE20
        </span>
      </span>

    </div>

    {/* CLOSE BUTTON */}
    <button
      type="button"
      onClick={() => setShowPromotion(false)}
      aria-label="Dismiss notification banner"
      className="absolute right-4 rounded p-2 transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-3 cursor-pointer fill-slate-50"
        aria-hidden="true"
        viewBox="0 0 329.269 329"
      >
        <path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" />
      </svg>
    </button>

  </div>
)}





      {/* banner */}

                   <section
                aria-labelledby="banner-heading"
                className="mt-6 w-full px-6 md:px-8"
              >
                <div
                  className="
                    relative mx-auto grid h-190px w-325 h-80
                    overflow-hidden rounded-2xl
                    bg-gradient-to-r from-indigo-950 via-blue-800 to-cyan-600
                    px-6
                    md:grid-cols-[1fr_320px]
                    md:px-10
                    lg:px-14
                  "
                >

                  {/* Decorative circles */}
                  <div className="absolute -left-12 -top-16 h-40 w-40 rounded-full bg-white/10" />
                  <div className="absolute bottom-[-80px] right-[25%] h-44 w-44 rounded-full bg-cyan-300/10" />

                  {/* LEFT */}
                  <div className="relative z-10 flex items-center py-7">

                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-yellow-300 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-900">
                          Limited Offer
                        </span>

                        <span className="text-xs font-medium text-blue-100">
                          Ends Soon
                        </span>
                      </div>

                      <h2
                        id="banner-heading"
                        className="text-2xl font-black text-white md:text-3xl"
                      >
                        Big Deals. Bigger Savings.
                      </h2>

                      <p className="mt-2 max-w-xl text-sm text-blue-100 md:text-base">
                        Shop your favourites and save up to
                        <span className="font-bold text-white"> 50% today.</span>
                      </p>


                     <a
  href="#products"
  onClick={(e) => {
    e.preventDefault();

    const section = document.getElementById("products");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        window.scrollBy({
          top: 150, // scroll 150px more down
          behavior: "smooth",
        });
      }, 150);
    }
  }}
  className="
    mt-5 inline-flex items-center gap-2
    rounded-lg bg-white px-5 py-2.5
    text-sm font-bold text-blue-900
    transition hover:bg-blue-50
  "
>
  Shop Deals
  <span>→</span>
</a>



                    </div>

                  </div>

                  {/* RIGHT */}
                  <div
                    className="relative hidden items-center justify-center md:flex"
                    aria-hidden="true"
                  >
                    {/* Discount circle */}
                    <div
                      className="
                        absolute left-0 top-6 z-20
                        flex h-20 w-20 rotate-[-8deg]
                        flex-col items-center justify-center
                        rounded-full bg-yellow-300
                        shadow-lg
                      "
                    >
                      <span className="text-xs font-bold text-slate-700">
                        UP TO
                      </span>

                      <span className="text-xl font-black text-slate-950">
                        50%
                      </span>

                      <span className="text-[10px] font-bold text-slate-700">
                        OFF
                      </span>
                    </div>

                    <img
                      src="https://readymadeui.com/images/tech-img.webp"
                      alt=""
                      className="
                        absolute bottom-0 right-4
                        h-[185px] w-[230px]
                        object-contain
                        drop-shadow-xl
                      "
                    />

                  </div>

                </div>
              </section>





      <section className="mx-auto mt-8 w-full max-w-[1200px] px-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="pointer-events-none absolute inset-0">
            <ShapeGrid
              speed={0.5}
              squareSize={40}
              direction="diagonal" // up, down, left, right, diagonal
              borderColor="#ffffff"
              hoverFillColor="#111827"
              shape="hexagon" // square, hexagon, circle, triangle
              hoverTrailAmount={5} // number of trailing hovered shapes (0 = no trail)
              className="w-full h-full"
            />
          </div>


          <div className="relative">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCategory("")}
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${category === ""
                    ? "border-teal-600 bg-teal-50 text-teal-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("electronics")}
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${category === "electronics"
                    ? "border-teal-600 bg-teal-50 text-teal-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  electronics
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("women")}
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${category === "women"
                    ? "border-teal-600 bg-teal-50 text-teal-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  women
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("men")}
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${category === "men"
                    ? "border-teal-600 bg-teal-50 text-teal-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  men
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products"
  className="mx-auto mt-6 w-full max-w-[1200px] px-6">
        {loadError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            {loadError}
          </div>
        )}

        {search && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Search results for "{search}"</h1>
            <p className="mt-2 text-sm text-slate-600">Showing exact matches first, followed by similar products below.</p>
          </div>
        )}

        {products.length === 0 && !loadError ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600 shadow-sm">
            No products match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            



            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}



          </div>

        )}
        {search && similarProducts.length > 0 && (
          <>
            <h2 className="mt-10 mb-5 text-2xl font-bold text-slate-900">
              Similar Products
            </h2>

            <div className="-mx-6 overflow-x-auto pb-4 px-6">
              <div className="flex gap-6">
                {similarProducts.map((product) => (
                  <article
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="min-w-[260px] cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="h-52 w-full object-cover"
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900">
                        {product.title}
                      </h3>

                      <p className="mt-2 text-lg font-bold text-slate-900">
                        ₹{product.price}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

