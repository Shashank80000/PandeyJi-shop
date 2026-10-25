import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { getCatalogue } from "../services/resourceCache.js";

export default function SearchBar() {
  const navigate = useNavigate();
  const { keyword } = useParams();
  const [query, setQuery] = useState(keyword || "");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);
  const requestVersion = useRef(0);

  // Search products
  const fetchProducts = async (searchTerm, signal) => {
    const version = ++requestVersion.current;
    if (!searchTerm?.trim()) {
      setResults([]);
      return;
    }

    try {
      const data = await getCatalogue({ search: searchTerm }, { signal });
      if (version !== requestVersion.current) return;
      setResults(data.products || []);
      setShowResults(true);
    } catch (err) {
      if (version !== requestVersion.current) return;
      if (err.name === "CanceledError" || err.name === "AbortError") return;
      console.error(err);
      setResults([]);
      setShowResults(false);
    }
  };

  useEffect(() => {
    setQuery(keyword || "");
    requestVersion.current += 1;
    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      if (active) fetchProducts(keyword || "", controller.signal);
    }, 250);
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedSearch = query.trim();

    if (trimmedSearch) {
      navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
    } else {
      navigate("/");
    }
    setShowResults(false);
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-xl px-4 py-6" ref={searchRef}>

      {/* Search input — this route previously rendered no input at all */}
      <form onSubmit={handleSubmit} role="search">
        <div className="flex h-12 items-center rounded-full border-line-strong bg-card-soft px-4 shadow-sm focus-within:border-[#e97855] focus-within:ring-4 focus-within:ring-[#e97855]/10">
          <Search size={18} className="shrink-0 text-ink-faint" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <button type="submit" className="rounded-full bg-accent px-4 py-1.5 text-xs font-black text-white transition hover:bg-accent-strong">
            Search
          </button>
        </div>
      </form>

      {/* Search Results */}
      {showResults && query && (
        <div className="absolute inset-x-4 top-full z-50 mt-2 rounded-xl border-line bg-card p-4 shadow-xl">
          {results.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-soft">No products found</p>
          ) : (
            <ul className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
              {results.map((product) => (
                <li key={product._id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="w-full cursor-pointer rounded-xl border-line p-3 text-left transition hover:shadow-lg"
                  >
                    <img
                      src={product.images?.[0] || product.image || ""}
                      alt={product.title || product.name}
                      className="aspect-square w-full rounded-lg object-cover"
                    />

                    <h3 className="mt-2 truncate text-sm font-semibold text-ink">
                      {product.title || product.name}
                    </h3>

                    <p className="text-sm font-bold text-accent">
                      ₹{Number(product.price || 0).toFixed(2)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

    </div>
  );
}
