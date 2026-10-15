import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    error,
    subtotal,
    totalCount,
    updateQuantity,
    removeFromCart,
    fetchCart,
    isItemLoading,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#070709] text-stone-200 selection:bg-[#CCA46B]/30 selection:text-[#E5C07B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#CCA46B] animate-pulse" />
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[#CCA46B]">
              Shopping Bag
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-white">
            My Cart
          </h1>
          {!loading && !error && cartItems.length > 0 && (
            <p className="text-stone-400 mt-2 text-xs sm:text-sm font-light">
              You have {totalCount} item{totalCount !== 1 ? "s" : ""} in your bag.
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#CCA46B]/20 border-t-[#CCA46B] animate-spin mb-4" />
            <p className="text-sm font-medium text-stone-400 tracking-wider">
              Loading your cart...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-300 text-sm font-medium mb-1">Unable to load your cart.</p>
            <p className="text-stone-500 text-xs mb-5">{error}</p>
            <button
              onClick={fetchCart}
              className="bg-[#14141C] hover:bg-[#1E1E28] border border-white/10 text-stone-200 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0E0E14] border border-white/[0.06] flex items-center justify-center mb-6 text-3xl">
              🛒
            </div>
            <h3 className="text-white text-xl font-medium mb-2">Your cart is empty 🛒</h3>
            <p className="text-stone-400 text-sm font-light mb-8 max-w-xs">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 text-black font-semibold text-xs uppercase tracking-[1.5px] px-6 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-[0_0_20px_rgba(204,164,107,0.25)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Browse Products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              {cartItems.map((item) => {
                const pId = item.product?._id || item.product;
                const status = isItemLoading(pId);
                return (
                  <CartItem
                    key={pId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    isUpdating={status === "updating"}
                    isRemoving={status === "removing"}
                  />
                );
              })}

              <div className="pt-4 flex justify-between items-center">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-[#CCA46B] transition-colors group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-[#0E0E14] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
                <h2 className="text-white text-lg font-medium mb-5 pb-4 border-b border-white/[0.06]">
                  Order Summary
                </h2>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between text-stone-400">
                    <span>Total Items</span>
                    <span className="text-white font-medium">{totalCount} units</span>
                  </div>

                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-400">
                    <span>Estimated Shipping</span>
                    <span className="text-emerald-400 font-medium">FREE</span>
                  </div>

                  <div className="flex justify-between text-stone-400">
                    <span>Taxes</span>
                    <span className="text-stone-400 text-xs">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-white/[0.08] pt-4 mt-2 flex justify-between items-baseline">
                    <span className="text-white font-semibold text-base">Total</span>
                    <span className="text-2xl font-bold text-[#E5C07B]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-[2px] py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,164,107,0.25)] cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>256-Bit SSL Secured Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
