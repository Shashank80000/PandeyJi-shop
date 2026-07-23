import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import api from "../api/axios";

export default function SearchBar() {
    const navigate = useNavigate();
    const { keyword } = useParams();
    const [query, setQuery] = useState(keyword || "");
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const searchRef = useRef(null);

    // Search products
    const fetchProducts = async (searchTerm) => {
        if (!searchTerm?.trim()) {
            setResults([]);
            return;
        }

        try {
            const { data } = await api.get(`/products?search=${encodeURIComponent(searchTerm)}`);
            setResults(data.products || []);
            setShowResults(true);
        } catch (err) {
            console.error(err);
            setResults([]);
            setShowResults(false);
        }
    };

    useEffect(() => {
        setQuery(keyword || "");
        fetchProducts(keyword || "");
    }, [keyword]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedSearch = query.trim();

        if (trimmedSearch) {
            navigate(`/search/${encodeURIComponent(trimmedSearch)}`);
        } else {
            navigate("/");
        }
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
        <div className="relative w-full max-w-xl" ref={searchRef}>
            

            {/* Search Results */}
            {showResults && query && (
                <div className="relative w-360    left-0 right-0 z-50 mt-2 overflow-x-auto rounded-xl border bg-white p-4 shadow-xl">
                    <div className="flex gap-5 align-items-center justify-center">
                        {results.length === 0 ? (
                            <p className="text-gray-500">No products found</p>
                        ) : (
                            results.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="min-w-[200px] cursor-pointer rounded-xl border p-3 transition hover:shadow-lg"
                                >
                                    <img
                                        src={product.images?.[0] || product.image || ""}
                                        alt={product.title || product.name}
                                        className="h-100 w-full rounded-lg object-cover"
                                    />

                                    <h3 className="mt-2 truncate font-semibold">
                                        {product.title || product.name}
                                    </h3>

                                    <p className="font-bold text-green-600">
                                        ₹{Number(product.price || 0).toFixed(2)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}


            
        </div>
    );
}