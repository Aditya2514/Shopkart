import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = ({ wishlistCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { totalCount } = useCart();
  const [loggingOut, setLoggingOut] = useState(false);
  const [count, setCount] = useState(wishlistCount ?? 0);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/customers/logout");
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  const fetchWishlistCount = () => {
    api.get("/wishlist")
      .then((res) => setCount(res.data.count || 0))
      .catch(() => setCount(0));
  };

  useEffect(() => {
    if (wishlistCount !== undefined) {
      setCount(wishlistCount);
    } else {
      fetchWishlistCount();
    }
  }, [location.pathname, wishlistCount]);

  useEffect(() => {
    const handleWishlistUpdate = (e) => {
      if (e?.detail?.count !== undefined) {
        setCount(e.detail.count);
      } else {
        fetchWishlistCount();
      }
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-xs font-semibold uppercase tracking-[1.5px] px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${isActive(to)
        ? "text-[#CCA46B] bg-white/[0.05]"
        : "text-stone-300 hover:text-white hover:bg-white/[0.03]"
        }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="w-full bg-[#070709]/85 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/products" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CCA46B] to-[#99733E] flex items-center justify-center text-black font-bold text-xs shadow-[0_0_15px_rgba(204,164,107,0.3)]">
              SK
            </div>
            <span className="text-xl tracking-tight font-editorial text-white group-hover:text-stone-200 transition-colors">
              Shop<span className="text-[#CCA46B] italic font-semibold">Kart</span>
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navLink("/products", "Products")}
            {navLink("/wishlist", "Wishlist")}
            {navLink("/cart", `Cart${totalCount > 0 ? ` (${totalCount})` : ""}`)}
            {navLink("/orders", "Orders")}
            {navLink("/home", "Account")}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="sm:hidden text-xs font-semibold uppercase text-stone-300 hover:text-[#CCA46B] px-2 py-1"
          >
            Products
          </Link>

          <Link
            to="/wishlist"
            title="Wishlist"
            className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${isActive("/wishlist")
              ? "bg-rose-950/50 border border-rose-500/40"
              : "bg-[#0E0E14] border border-white/10 hover:border-rose-500/40 hover:bg-rose-950/20"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`h-5 w-5 transition-colors ${isActive("/wishlist") ? "text-rose-400" : "text-stone-400"
                }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path
                d="M12 17c0 0-3.5-2.2-3.5-4.5a2 2 0 014 0 2 2 0 014 0C16.5 14.8 12 17 12 17z"
                fill={isActive("/wishlist") ? "currentColor" : "none"}
                strokeWidth={1.3}
              />
            </svg>
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                lineHeight: 1,
                borderRadius: '9999px',
              }}
              className={count > 0 ? "bg-rose-500 text-white shadow-lg" : "bg-stone-600 text-white shadow-md"}
            >
              {count}
            </span>
          </Link>

          <Link
            to="/cart"
            title="Shopping Cart"
            className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${isActive("/cart")
              ? "bg-[#CCA46B]/20 border border-[#CCA46B]/50"
              : "bg-[#0E0E14] border border-white/10 hover:border-[#CCA46B]/40 hover:bg-[#CCA46B]/10"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`h-5 w-5 transition-colors ${isActive("/cart") ? "text-[#E5C07B]" : "text-stone-400"
                }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                lineHeight: 1,
                borderRadius: '9999px',
              }}
              className={
                totalCount > 0
                  ? "bg-gradient-to-r from-[#D9A862] to-[#CCA46B] text-black shadow-lg"
                  : "bg-stone-600 text-white shadow-md"
              }
            >
              {totalCount}
            </span>
          </Link>

          <button
            id="logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 bg-[#0E0E14] hover:bg-[#181822] border border-white/10 hover:border-[#CCA46B]/40 text-stone-300 hover:text-[#CCA46B] text-xs font-medium tracking-wider uppercase px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {loggingOut ? (
              <svg className="animate-spin h-3.5 w-3.5 text-[#CCA46B]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            )}
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
