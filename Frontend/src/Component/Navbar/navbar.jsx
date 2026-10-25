import { useEffect, useState } from "react";
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { clearPrivateCache, getCart } from "../../services/resourceCache.js";
import { getStaticCartCount } from "../../services/staticCart.js";
import { useTheme } from "../../services/ThemeContext.jsx";

export default function Navbar() {
 const navigate = useNavigate();
 const [cartCount, setCartCount] = useState(0);
 const [searchValue, setSearchValue] = useState("");
 const [menuOpen, setMenuOpen] = useState(false);
 const { theme, toggleTheme } = useTheme();

 const userId = localStorage.getItem("userId");
 const userName = localStorage.getItem("name");

 const handleSearchSubmit = (event) => {
  event.preventDefault();
  const trimmedSearch = searchValue.trim();
  navigate(trimmedSearch ? `/?search=${encodeURIComponent(trimmedSearch)}` : "/");
  setMenuOpen(false);
 };

 useEffect(() => {
  const loadStaticCart = () => setCartCount(getStaticCartCount());
  const loadCart = async () => {
   try {
    if (!userId) {
     loadStaticCart();
     return;
    }
    const data = await getCart(userId);
    const items = data?.cart?.items ?? [];
    setCartCount(items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) + getStaticCartCount());
   } catch {
    loadStaticCart();
   }
  };

  const handleCartUpdate = (event) => {
   if (event.detail?.userId !== userId) return;
   const items = event.detail?.cart?.items;
   if (Array.isArray(items)) {
    setCartCount(items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) + getStaticCartCount());
    return;
   }
   loadCart();
  };

  loadCart();
  window.addEventListener("cartUpdated", handleCartUpdate);
  window.addEventListener("staticCartUpdated", loadCart);
  return () => {
   window.removeEventListener("cartUpdated", handleCartUpdate);
   window.removeEventListener("staticCartUpdated", loadCart);
  };
 }, [userId]);

 const logout = () => {
  clearPrivateCache();
  const savedTheme = theme;
  localStorage.clear();
  localStorage.setItem("theme", savedTheme);
  setCartCount(0);
  navigate("/login");
 };

 return (
  <header className="sticky top-0 z-40 border-b border-line bg-page/95 backdrop-blur">
   <nav className="mx-auto flex w-full max-w-345 flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
    <Link to="/" className="flex shrink-0 items-center gap-2.5 text-ink">
     <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-lg font-black text-white shadow-[0_6px_16px_rgba(233,120,85,0.25)]">P</span>
     <span className="hidden text-xl font-black tracking-tight sm:block">Pandey Shop</span>
    </Link>

    <form onSubmit={handleSearchSubmit} className="order-3 flex w-full items-center lg:order-0 lg:mx-auto lg:max-w-145">
     <div className="flex h-11 w-full items-center rounded-full border border-line-strong bg-card-soft px-4 shadow-sm transition focus-within:border-accent focus-within:bg-card focus-within:ring-4 focus-within:ring-accent/10">
      <Search size={18} className="shrink-0 text-ink-faint" aria-hidden="true" />
      <input type="search" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search your next favorite thing" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink-faint" aria-label="Search products" />
      <button type="submit" className="hidden rounded-full bg-accent px-4 py-1.5 text-xs font-black text-white transition hover:bg-accent-strong sm:block">Search</button>
     </div>
    </form>

    <div className="ml-auto flex items-center gap-2">
     <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-card text-ink-soft shadow-sm transition hover:border-accent hover:text-accent" aria-label="Open cart" title="Cart">
      <ShoppingBag size={18} />
      {cartCount > 0 && <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-black text-white">{cartCount}</span>}
     </Link>
     <button type="button" className="hidden h-10 w-10 place-items-center rounded-full border border-line-strong bg-card text-ink-soft shadow-sm transition hover:border-accent hover:text-accent sm:grid" aria-label="Wishlist" title="Wishlist is not available in this backend yet"><Heart size={18} /></button>
     <button type="button" onClick={toggleTheme} className="hidden h-10 w-10 place-items-center rounded-full border border-line-strong bg-card text-ink-soft shadow-sm transition hover:border-accent hover:text-accent sm:grid" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
     <div className="hidden items-center gap-2 sm:flex">
      {userId ? <button type="button" onClick={logout} className="flex items-center gap-2 rounded-full border border-line-strong bg-card px-3 py-2 text-sm font-bold text-ink-soft transition hover:border-accent hover:text-accent"><User size={16} />{userName || "Account"}</button> : <Link to="/login" className="flex items-center gap-2 rounded-full border border-line-strong bg-card px-3 py-2 text-sm font-bold text-ink-soft transition hover:border-accent hover:text-accent"><User size={16} />Login</Link>}
      {!userId && <Link to="/signup" className="rounded-full bg-accent px-4 py-2 text-sm font-black text-white transition hover:bg-accent-strong">Sign up</Link>}
     </div>
     <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu" className="grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-card text-ink-soft sm:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
    </div>

    {menuOpen && <div id="mobile-menu" className="order-4 flex w-full flex-col gap-2 border-t border-line pt-3 sm:hidden">
     <button type="button" onClick={toggleTheme} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-ink-soft hover:bg-card-soft" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>{theme === "dark" ? "Light mode" : "Dark mode"}{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
     <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm font-bold text-ink-soft hover:bg-card-soft">Shop</Link>
     <Link to={userId ? "/" : "/login"} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm font-bold text-ink-soft hover:bg-card-soft">{userId ? `Hi, ${userName || "Account"}` : "Login / Account"}</Link>
     {userId ? <button type="button" onClick={logout} className="rounded-xl px-3 py-2 text-left text-sm font-bold text-accent-ink hover:bg-accent-soft">Logout</button> : <Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-xl bg-accent px-3 py-2 text-sm font-black text-white">Create account</Link>}
    </div>}
   </nav>
  </header>
 );
}
