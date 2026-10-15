import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError(res.data.message || "Could not retrieve order details");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load order confirmation"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleCopyId = () => {
    if (order?._id) {
      navigator.clipboard.writeText(order._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const orderStages = [
    { key: "PLACED", label: "Placed" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const getStageIndex = (status) => {
    const idx = orderStages.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return {
          bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
          dot: "bg-emerald-400",
          label: "Delivered",
        };
      case "SHIPPED":
        return {
          bg: "bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)]",
          dot: "bg-sky-400",
          label: "Shipped",
        };
      case "CONFIRMED":
        return {
          bg: "bg-teal-500/15 text-teal-300 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.15)]",
          dot: "bg-teal-400",
          label: "Confirmed",
        };
      case "PLACED":
        return {
          bg: "bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.1)]",
          dot: "bg-amber-400",
          label: "Placed",
        };
      case "FAILED":
        return {
          bg: "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]",
          dot: "bg-rose-400",
          label: "Failed",
        };
      case "PENDING_PAYMENT":
      default:
        return {
          bg: "bg-stone-500/15 text-stone-300 border-stone-500/30",
          dot: "bg-stone-400",
          label: status || "Pending",
        };
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Payment: PAID
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-semibold shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Payment: FAILED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Payment: PENDING
          </span>
        );
    }
  };

  const statusBadge = order ? getStatusBadge(order.status) : null;
  const currentStageIdx = order ? getStageIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-[#070709] text-stone-200 selection:bg-[#CCA46B]/30 selection:text-[#E5C07B]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#CCA46B]/20 border-t-[#CCA46B] animate-spin mb-4" />
            <p className="text-sm font-medium text-stone-400 tracking-wider">
              Loading order confirmation...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-300 text-sm font-medium mb-1">Unable to load order</p>
            <p className="text-stone-500 text-xs mb-5">{error}</p>
            <Link
              to="/orders"
              className="inline-block bg-[#14141C] hover:bg-[#1E1E28] border border-white/10 text-stone-200 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              Go to My Orders
            </Link>
          </div>
        ) : (
          <div className="bg-[#0E0E14] border border-white/[0.08] rounded-2xl p-6 sm:p-10 shadow-2xl">
            <div className="text-center pb-8 border-b border-white/[0.06]">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                ✓
              </div>
              <p className="text-xs font-semibold tracking-[3px] uppercase text-[#CCA46B] mb-1">
                Payment Verified & Confirmed
              </p>
              <h1 className="text-3xl sm:text-4xl font-editorial text-white mb-2">
                Order Placed Successfully
              </h1>
              <p className="text-stone-400 text-sm max-w-md mx-auto">
                Thank you for your purchase. Your order has been registered and is being processed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8 p-4 rounded-xl bg-[#14141C]/80 border border-white/[0.05]">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-stone-400">Order ID</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-white font-mono text-xs truncate select-all">
                    #{order._id}
                  </p>
                  <button
                    onClick={handleCopyId}
                    type="button"
                    className="text-stone-400 hover:text-white text-[11px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                    title="Copy Order ID"
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-stone-400">Total Amount</p>
                <p className="text-[#E5C07B] font-bold text-base sm:text-lg mt-0.5">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-stone-400">Payment Status</p>
                <div className="mt-1">
                  {getPaymentBadge(order.paymentStatus)}
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-stone-400">Fulfillment</p>
                <div className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold tracking-wide ${statusBadge.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} animate-pulse`} />
                  {statusBadge.label}
                </div>
              </div>
            </div>

            <div className="mb-8 p-4 sm:p-5 rounded-xl bg-[#14141C]/50 border border-white/[0.05]">
              <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-4 text-center sm:text-left">
                Order Tracking Status
              </div>
              <div className="grid grid-cols-4 gap-2 relative">
                {orderStages.map((stage, idx) => {
                  const isCompleted = idx < currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  const isDelivered = order.status === "DELIVERED";

                  return (
                    <div key={stage.key} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isCompleted || (isCurrent && isDelivered)
                            ? "bg-emerald-500 text-black border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                            : isCurrent
                            ? "bg-[#CCA46B] text-black border-2 border-[#E5C07B] shadow-[0_0_15px_rgba(204,164,107,0.4)] animate-pulse"
                            : "bg-[#1C1C26] text-stone-500 border border-white/10"
                        }`}
                      >
                        {isCompleted || (isCurrent && isDelivered) ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`mt-1.5 text-[10px] sm:text-[11px] font-medium tracking-wide ${
                          isCompleted || (isCurrent && isDelivered)
                            ? "text-emerald-400"
                            : isCurrent
                            ? "text-[#E5C07B] font-bold"
                            : "text-stone-500"
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}

                <div className="absolute top-3.5 sm:top-4 left-[12%] right-[12%] h-[2px] bg-white/[0.08] -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#CCA46B] transition-all duration-500"
                    style={{
                      width: `${(currentStageIdx / (orderStages.length - 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="mb-8 p-4 rounded-xl bg-[#14141C]/40 border border-white/[0.04]">
                <h3 className="text-xs uppercase tracking-wider text-[#CCA46B] font-semibold mb-2">
                  Delivery Destination
                </h3>
                <p className="text-white text-sm font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-stone-400 text-xs mt-0.5">
                  {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
                <p className="text-stone-400 text-xs mt-0.5">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">
                Purchased Items ({order.items?.length || 0})
              </h3>
              <div className="divide-y divide-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden bg-[#14141C]/30">
                {order.items?.map((item) => (
                  <div key={item._id || item.product} className="p-3 sm:p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#14141C] border border-white/10 overflow-hidden shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600 text-xs">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-stone-400 text-xs">
                        Quantity: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-stone-200 font-semibold text-sm">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/[0.06]">
              <Link
                to="/orders"
                className="w-full sm:w-auto bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 text-black font-semibold text-xs uppercase tracking-[1.5px] px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(204,164,107,0.25)] text-center"
              >
                View My Orders
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto bg-[#14141C] hover:bg-[#1E1E28] border border-white/10 text-stone-300 hover:text-white font-semibold text-xs uppercase tracking-[1.5px] px-6 py-3.5 rounded-xl transition-all text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderSuccess;
