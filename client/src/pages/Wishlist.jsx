import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import WishlistCard from "../components/WishlistCard";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while loading your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  return (
    <div className="min-h-screen bg-[#070709] text-stone-200 selection:bg-[#CCA46B]/30 selection:text-[#E5C07B]">
      <Navbar wishlistCount={loading ? undefined : wishlist.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-rose-400">
              My Wishlist
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-white">
            Saved Products
          </h1>
          {!loading && !error && (
            <p className="text-stone-400 mt-2 text-xs sm:text-sm font-light">
              {wishlist.length === 0
                ? "You haven't saved anything yet."
                : `${wishlist.length} product${wishlist.length > 1 ? "s" : ""} saved`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin mb-4" />
            <p className="text-sm font-medium text-stone-400 tracking-wider">
              Loading your wishlist...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-300 text-sm font-medium mb-2">Something went wrong.</p>
            <p className="text-stone-500 text-xs mb-5">We couldn't load your wishlist.</p>
            <button
              onClick={fetchWishlist}
              className="bg-[#14141C] hover:bg-[#1E1E28] border border-white/10 text-stone-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0E0E14] border border-white/[0.06] flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-rose-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-stone-400 text-sm font-light mb-8 max-w-xs">
              Save products you love and find them here later.
            </p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 text-black font-semibold text-xs uppercase tracking-[1.5px] px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-[0_0_20px_rgba(204,164,107,0.2)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <WishlistCard
                  key={product._id}
                  product={product}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-[#CCA46B] transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
