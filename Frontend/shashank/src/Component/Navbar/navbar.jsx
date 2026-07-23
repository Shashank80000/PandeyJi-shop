import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "../../../src/api/axios";

export default function Navbar() {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    // const [searchParams, setSearchParams] = useSearchParams();
    // const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
    const [searchValue, setSearchValue] = useState("");

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedSearch = searchValue.trim();

        if (trimmedSearch) {
            navigate(`/search/${encodeURIComponent(trimmedSearch)}`);
        } else {
            navigate("/");
        }
    };

    // useEffect(() => {
    //     setSearchValue(searchParams.get("search") || "");
    // }, [searchParams]);

    // Theme (applies to whole website by toggling `dark` class on <html>)
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "light";
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") return saved;
        return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");

        localStorage.setItem("theme", theme);
    }, [theme]);

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("name");

    useEffect(() => {
        const loadCart = async () => {
            try {
                if (!userId) return setCartCount(0);

                const res = await api.get(`/cart/${userId}`);
                const items = res.data.cart?.items ?? [];
                const total = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
                setCartCount(total);
            } catch {
                setCartCount(0);
            }
        }
        loadCart();
        window.addEventListener("cartUpdated", loadCart);

        return () => {
            window.removeEventListener("cartUpdated", loadCart);
        }
    }, [userId]);

    const logout = () => {
        localStorage.clear();
        // re-apply current theme preference after clearing other values
        localStorage.setItem("theme", theme);
        setCartCount(0);
        navigate("/login");
    };

    const toggleTheme = () => {
        setTheme((t) => (t === "dark" ? "light" : "dark"));
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <nav className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6">
                <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-lg text-white">P</span>
                    Pandey Shop
                </Link>

                <form onSubmit={handleSearchSubmit} className="mx-4 flex flex-1 max-w-xs">
                    <input
                        type="text"
                        placeholder="Search products by title"
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="h-10 flex-1 rounded-xl border border-slate-300 px-4 text-sm text-slate-800 outline-none ring-teal-600 transition focus:border-teal-600 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    />
                </form>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                        Shop
                    </Link>
                   

                    <Link to="/cart" className="relative rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900">
                        Cart
                        {cartCount > 0 && (
                            <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
                        aria-label="Toggle theme"
                        title="Toggle theme"
                    >
                        {theme === "dark" ? "🌙" : "☀️"}
                    </button>

                    {!userId ? (
                        <>
                            <Link to="/login" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-200">
                                Login
                            </Link>
                            <Link to="/signup" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
                                Signup
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="hidden text-sm font-medium text-slate-600 lg:block dark:text-slate-300">
                                Hi, {userName || "User"}
                            </span>
                            <button onClick={logout} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}
