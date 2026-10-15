import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category && category !== "All") params.category = category;
      if (sort) params.sort = sort;

      const res = await api.get("/products", { params });
      setProducts(res.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/wishlist")
      .then((res) => {
        const ids = new Set((res.data.wishlist || []).map((p) => p._id));
        setWishlistIds(ids);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleWishlistUpdated = (e) => {
      if (e?.detail?.productId) {
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (e.detail.saved) {
            next.add(e.detail.productId);
          } else {
            next.delete(e.detail.productId);
          }
          return next;
        });
      }
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdated);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdated);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, category, sort]);

  return (
    <div className="min-h-screen bg-[#070709] text-stone-200 selection:bg-[#CCA46B]/30 selection:text-[#E5C07B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#CCA46B] animate-pulse" />
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[#CCA46B]">
              Product Catalogue
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-white">
            Explore Collection
          </h1>
          <p className="text-stone-400 mt-2 text-xs sm:text-sm font-light">
            Discover curated electronics, lifestyle essentials, literature, and everyday goods.
          </p>
        </div>

        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#CCA46B]/20 border-t-[#CCA46B] animate-spin mb-4" />
            <p className="text-sm font-medium text-stone-400 tracking-wider">
              Loading products...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-300 text-sm font-medium mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-[#14141C] hover:bg-[#1E1E28] border border-white/10 text-stone-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#0E0E14] border border-white/[0.08] rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-[#14141C] text-stone-400 flex items-center justify-center mx-auto mb-4 text-2xl">
              📦
            </div>
            <h3 className="text-white text-lg font-medium mb-1">No products found.</h3>
            <p className="text-stone-400 text-xs font-light mb-5">
              Try adjusting your search query or choosing another category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSort("");
              }}
              className="bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] text-black font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:brightness-110 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isSaved={wishlistIds.has(product._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
