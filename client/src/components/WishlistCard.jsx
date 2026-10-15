import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const WishlistCard = ({ product, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (removing) return;
    setRemoving(true);
    try {
      const res = await api.delete(`/wishlist/${product._id}`);
      onRemove(product._id);
      window.dispatchEvent(
        new CustomEvent("wishlist-updated", {
          detail: { count: res.data.count, productId: product._id, saved: false },
        })
      );
    } catch (err) {
      setRemoving(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-[#0E0E14] border border-white/[0.08] hover:border-[#CCA46B]/30 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] group">
      <div className="relative aspect-square overflow-hidden bg-[#14141C]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-white/10 text-stone-300 text-[11px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
          {product.category}
        </span>
        <span className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-rose-950/80 border border-rose-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 fill-rose-500 text-rose-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-white text-base font-medium line-clamp-1 group-hover:text-[#CCA46B] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline justify-between mt-2.5">
            <span className="text-[#E5C07B] text-xl font-semibold">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isOutOfStock
                ? "bg-red-950/60 text-red-400 border border-red-900/50"
                : product.stock < 5
                ? "bg-amber-950/60 text-amber-400 border border-amber-900/50"
                : "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40"
            }`}>
              {isOutOfStock ? "Out of stock" : `${product.stock} units left`}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Link
            to={`/products/${product._id}`}
            className="w-full bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-[1.5px] py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            onClick={handleRemove}
            disabled={removing}
            className="w-full border border-rose-800/50 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 text-xs font-semibold uppercase tracking-[1.5px] py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {removing ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>Removing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Remove</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
