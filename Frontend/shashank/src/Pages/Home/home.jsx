import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate, useSearchParams } from "react-router";
import ShapeGrid from "../../Component/ShapeGrid/ShapeGrid";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [category, setCategory] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadProducts = async () => {
    try {
      const res = await api.get(`/products?search=${search}&category=${category}`);

      const productList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.products)
          ? res.data.products
          : [];

      setProducts(productList);
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

  return (
    <div className="bg-slate-50 pb-12">

      {/* Last time offer */}

      <div role="region" aria-label="Promotion"
   class="bg-blue-700 px-4 py-2.5 relative flex items-center justify-center text-center md:px-6">

   <div class="flex items-center justify-center flex-wrap gap-y-4 gap-x-6 pr-6">
      <p class="text-sm font-medium text-white">Limited time offer - </p>
      <div class="flex items-center gap-3">
         <div class="flex items-center gap-1">
            <span class="text-sm leading-tight font-semibold bg-white px-2.5 py-1.5 rounded-md mx-1">04</span>
            <span class="text-xs text-slate-50">DAYS</span>
         </div>
         <div class="flex items-center gap-1">
            <span class="text-sm leading-tight font-semibold bg-white px-2.5 py-1.5 rounded-md mx-1">06</span>
            <span class="text-xs text-slate-50">HRS</span>
         </div>
         <div class="flex items-center gap-1">
            <span class="text-sm leading-tight font-semibold bg-white px-2.5 py-1.5 rounded-md mx-1">42</span>
            <span class="text-xs text-slate-50">MIN</span>
         </div>
      </div>
      <span class="text-sm text-white">Use code - <span class="font-bold text-white ml-1">SAVE20</span></span>
   </div>

   <button type="button" aria-label="Dismiss notification banner"
      class="absolute right-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-3 cursor-pointer fill-slate-50" aria-hidden="true"
         viewBox="0 0 329.269 329">
         <path
            d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" />
      </svg>
   </button>
</div>

      {/* banner */}

        <section aria-labelledby="banner-heading" class="px-4 md:px-8 mt-6">
  <div class="grid px-6 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 rounded-lg overflow-hidden
    min-h-48 max-w-5xl mx-auto md:grid-cols-3 md:gap-6 md:px-12">

    <div class="md:col-span-2 py-6 md:py-8 md:max-w-xl">
      <h2 id="banner-heading" class="text-3xl font-bold text-slate-50 mb-4 md:text-4xl">
        Build with ReadymadeUI
      </h2>
      <p class="text-base text-slate-100 leading-relaxed">
        The professional Tailwind CSS platform for high-speed development, built to help you design and launch modern
        interfaces.
      </p>

      <div class="mt-8">
        <a href="#"
          class="py-2 px-3.5 text-sm inline-block rounded-md font-semibold cursor-pointer text-slate-900 border border-white bg-white hover:bg-slate-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          Explore Templates
        </a>
      </div>
    </div>

    <div class="relative hidden h-full aspect-[22/16] md:block" aria-hidden="true">
      <img src="https://readymadeui.com/images/tech-img.webp" alt="banner image"
        class="w-full h-full right-0 top-0 md:absolute object-contain object-center" />
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
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${
                    category === ""
                      ? "border-teal-600 bg-teal-50 text-teal-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("electronics")}
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${
                    category === "electronics"
                      ? "border-teal-600 bg-teal-50 text-teal-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  electronics
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("women")}
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${
                    category === "women"
                      ? "border-teal-600 bg-teal-50 text-teal-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  women
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("men")}
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${
                    category === "men"
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

      <section className="mx-auto mt-6 w-full max-w-[1200px] px-6">
        {loadError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            {loadError}
          </div>
        )}

        {products.length === 0 && !loadError ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600 shadow-sm">
            No products match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="mx-auto w-full max-w-sm cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div className="flex flex-wrap justify-between gap-4 px-4 py-3 sm:px-6">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                      {product.title}
                    </h3>
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex cursor-pointer items-center gap-1"
                    aria-label="Save product"
                    title="Save this product"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-[18px] fill-slate-900 overflow-visible hover:fill-blue-600 dark:fill-slate-50"
                      viewBox="0 0 67.949 67.949"
                    >
                      <path d="M62.49 11.239c-7.39-7.388-19.412-7.388-26.8 0l-1.716 1.715-1.715-1.715c-7.388-7.389-19.411-7.389-26.799 0-7.238 7.238-7.285 18.711-.109 26.688 6.545 7.273 25.848 22.986 26.667 23.651a3 3 0 0 0 1.89.672l.065-.001c.688.032 1.381-.204 1.955-.671.819-.665 20.124-16.378 26.671-23.652 7.175-7.976 7.128-19.449-.109-26.687m-4.351 22.674c-5.103 5.669-19.13 17.361-24.166 21.51-5.036-4.148-19.06-15.839-24.162-21.509-5.006-5.564-5.053-13.488-.109-18.432 2.525-2.524 5.841-3.787 9.157-3.787s6.632 1.262 9.157 3.787l3.772 3.772a2.9 2.9 0 0 0 1.609.811 3 3 0 0 0 2.76-.81l3.774-3.773c5.051-5.049 13.267-5.048 18.315 0 4.944 4.944 4.897 12.868-.107 18.431" />
                    </svg>
                  </button>
                </div>

                <Link to={`/product/${product._id}`}>
                  <div className="aspect-[3/2] w-full bg-gray-50 dark:bg-neutral-700">
                    <img
                      src={
                        Array.isArray(product.images) && product.images.length > 0
                          ? product.images[0]
                          : product.image || ""
                      }
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>

                <div className="p-4 sm:p-6">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {product.description || "No description available for this product."}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
                      ₹{Number(product.price || 0).toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product._id);
                      }}
                      className="inline-block cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

