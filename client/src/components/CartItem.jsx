import { Link } from "react-router-dom";

const CartItem = ({ item, onUpdateQuantity, onRemove, isUpdating, isRemoving }) => {
  const product = item.product || {};
  const isMaxStock = item.quantity >= product.stock;
  const isMinQuantity = item.quantity <= 1;

  const handleDecrease = () => {
    if (isMinQuantity || isUpdating || isRemoving) return;
    onUpdateQuantity(product._id, item.quantity - 1);
  };

  const handleIncrease = () => {
    if (isMaxStock || isUpdating || isRemoving) return;
    onUpdateQuantity(product._id, item.quantity + 1);
  };

  return (
    <div className="bg-[#0E0E14] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Link
          to={`/products/${product._id}`}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#14141C] border border-white/[0.05] shrink-0 block"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase font-semibold text-[#CCA46B] tracking-wider">
            {product.category}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="block text-white text-sm sm:text-base font-medium truncate hover:text-[#CCA46B] transition-colors mt-0.5"
          >
            {product.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-stone-300 text-sm font-semibold">
              ₹{(product.price || 0).toLocaleString("en-IN")}
            </span>
            <span className="text-stone-600 text-xs">·</span>
            <span
              className={`text-[11px] font-medium ${
                product.stock < 5 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {product.stock < 5 ? `Only ${product.stock} left` : "In stock"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
        <div className="flex flex-col items-start sm:items-center">
          <div className="inline-flex items-center bg-[#14141C] border border-white/10 rounded-xl p-1 shadow-inner">
            <button
              onClick={handleDecrease}
              disabled={isMinQuantity || isUpdating || isRemoving}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-sm font-bold"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-white text-xs font-semibold tabular-nums">
              {isUpdating ? (
                <span className="inline-block animate-pulse text-[#CCA46B]">...</span>
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={handleIncrease}
              disabled={isMaxStock || isUpdating || isRemoving}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-sm font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {isMaxStock && (
            <span className="text-[10px] text-amber-400/80 mt-1">Max stock reached</span>
          )}
        </div>

        <div className="text-right min-w-[90px]">
          <p className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
            Total
          </p>
          <p className="text-base sm:text-lg font-semibold text-[#E5C07B] mt-0.5">
            ₹{((product.price || 0) * item.quantity).toLocaleString("en-IN")}
          </p>
        </div>

        <button
          onClick={() => onRemove(product._id)}
          disabled={isRemoving || isUpdating}
          className="p-2 sm:p-2.5 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Remove from cart"
          aria-label="Remove item"
        >
          {isRemoving ? (
            <svg className="animate-spin h-4 w-4 text-rose-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
