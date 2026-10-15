import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const { addToCart, getItemQuantity, isItemLoading } = useCart();

  const quantityInCart = getItemQuantity(id);
  const isAdding = isItemLoading(id) === "adding";
  const isMaxStock = quantityInCart >= (product?.stock || 0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product || res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong while loading the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0 || isAdding || isMaxStock) return;
    const res = await addToCart(product._id);
    if (res?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-stone-200 selection:bg-[#CCA46B]/30 selection:text-[#E5C07B]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-[#CCA46B] transition-colors mb-8 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Products</span>
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#CCA46B]/20 border-t-[#CCA46B] animate-spin mb-4" />
            <p className="text-sm font-medium text-stone-400 tracking-wider">
              Loading product details...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
            <p className="text-red-300 text-sm font-medium mb-4">{error}</p>
            <Link
              to="/products"
              className="inline-block bg-[#14141C] hover:bg-[#1E1E28] border border-white/10 text-stone-200 text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Return to Catalog
            </Link>
          </div>
        ) : product ? (
          <div className="bg-[#0E0E14] border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#14141C] border border-white/[0.05] shadow-xl relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-white/15 text-[#CCA46B] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#CCA46B] animate-pulse" />
                    <span className="text-xs uppercase tracking-[2px] font-semibold text-[#CCA46B]">
                      Verified Authentic
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-editorial font-normal text-white leading-tight mb-4">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-semibold text-[#E5C07B]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        product.stock <= 0
                          ? "bg-red-950/60 text-red-400 border border-red-900/50"
                          : product.stock < 5
                          ? "bg-amber-950/60 text-amber-400 border border-amber-900/50"
                          : "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40"
                      }`}
                    >
                      {product.stock <= 0 ? "Out of Stock" : `${product.stock} units left in stock`}
                    </span>
                  </div>

                  <div className="border-t border-white/[0.08] pt-6 mb-6">
                    <h2 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                      Description
                    </h2>
                    <p className="text-sm text-stone-300 font-light leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="p-3.5 rounded-xl bg-[#14141C] border border-white/[0.05]">
                      <p className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                        Category
                      </p>
                      <p className="text-sm text-stone-200 font-medium mt-0.5">
                        {product.category}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#14141C] border border-white/[0.05]">
                      <p className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
                        Availability
                      </p>
                      <p className="text-sm text-emerald-400 font-medium mt-0.5">
                        {product.stock > 0 ? "In Stock" : "Unavailable"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || isAdding || isMaxStock}
                    className="w-full bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-xs uppercase tracking-[2px] py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(204,164,107,0.25)] cursor-pointer"
                  >
                    {isAdding ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span>Adding to Bag...</span>
                      </>
                    ) : isMaxStock ? (
                      <span>Max Units in Cart ({quantityInCart})</span>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        <span>{added ? "Added to Cart ✓" : quantityInCart > 0 ? `Add Another (${quantityInCart})` : "Add to Cart"}</span>
                      </>
                    )}
                  </button>
                  {added && (
                    <p className="text-center text-xs text-emerald-400 mt-2">
                      Item added to your shopping bag!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ProductDetails;
