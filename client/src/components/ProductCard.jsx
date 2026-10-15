import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, isSaved }) => {
  const isOutOfStock = product.stock <= 0;
  const [wishlistState, setWishlistState] = useState("idle");
  const [saved, setSaved] = useState(isSaved || false);
  const { addToCart, getItemQuantity, isItemLoading } = useCart();

  const quantityInCart = getItemQuantity(product._id);
  const isAddingToCart = isItemLoading(product._id) === "adding";
  const isCartMax = quantityInCart >= product.stock;

  useEffect(() => {
    if (isSaved !== undefined) {
      setSaved(isSaved);
    }
  }, [isSaved]);

  const handleWishlistToggle = async () => {
    if (wishlistState === "loading") return;
    setWishlistState("loading");

    try {
      const res = await api.patch(`/wishlist/${product._id}/toggle`);
      setSaved(res.data.saved);
      setWishlistState("idle");
      window.dispatchEvent(
        new CustomEvent("wishlist-updated", {
          detail: { count: res.data.count, productId: product._id, saved: res.data.saved },
        })
      );
    } catch (err) {
      setWishlistState("error");
      setTimeout(() => setWishlistState("idle"), 3000);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isAddingToCart || isCartMax) return;
    await addToCart(product._id);
  };

  return (
    <div className="bg-[#0E0E14] border border-white/[0.08] hover:border-[#CCA46B]/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
      <div className="relative aspect-square overflow-hidden bg-[#14141C]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-white/10 text-stone-300 text-[11px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
          {product.category}
        </span>
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistState === "loading"}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-rose-500/50 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
          title={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-colors ${saved ? "text-rose-500 fill-rose-500" : "text-stone-400"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
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
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isOutOfStock
                  ? "bg-red-950/60 text-red-400 border border-red-900/50"
                  : product.stock < 5
                  ? "bg-amber-950/60 text-amber-400 border border-amber-900/50"
                  : "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40"
              }`}
            >
              {isOutOfStock ? "Out of stock" : `${product.stock} units left`}
            </span>
          </div>
        </div>

        {wishlistState === "error" && (
          <p className="text-xs text-rose-400 mt-3">Unable to save product. Please try again.</p>
        )}

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart || isCartMax}
            className="w-full bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-xs uppercase tracking-[1.5px] py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(204,164,107,0.2)] cursor-pointer"
          >
            {isAddingToCart ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-black" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>Adding...</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : isCartMax ? (
              <span>Max in Cart ({quantityInCart})</span>
            ) : quantityInCart > 0 ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Another ({quantityInCart})</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/products/${product._id}`}
              className="bg-[#14141C] hover:bg-[#1C1C28] border border-white/10 hover:border-white/20 text-stone-300 hover:text-white text-[11px] font-semibold uppercase tracking-wider py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <span>Details</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              onClick={handleWishlistToggle}
              disabled={wishlistState === "loading"}
              className={`border text-[11px] font-semibold uppercase tracking-wider py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                saved
                  ? "border-rose-500/50 bg-rose-950/30 text-rose-400 hover:bg-rose-950/50"
                  : "border-white/10 bg-[#14141C] text-stone-300 hover:border-rose-500/40 hover:text-rose-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3 w-3 ${saved ? "fill-rose-500 text-rose-500" : "text-stone-400"}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
