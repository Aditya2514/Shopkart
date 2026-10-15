import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders");
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError(res.data.message || "Could not retrieve your orders");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      setUpdatingStatusId(orderId);
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: nextStatus,
      });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? res.data.order : ord))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to advance order status");
    } finally {
      setUpdatingStatusId(null);
    }
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

  const getAdvanceButtonConfig = (nextStatus) => {
    switch (nextStatus) {
      case "CONFIRMED":
        return {
          className:
            "bg-teal-950/60 hover:bg-teal-900/90 border border-teal-500/50 hover:border-teal-400 text-teal-300 hover:text-white shadow-[0_0_16px_rgba(20,184,166,0.25)]",
          icon: "✓",
          text: "Advance → CONFIRMED",
        };
      case "SHIPPED":
        return {
          className:
            "bg-sky-950/60 hover:bg-sky-900/90 border border-sky-500/50 hover:border-sky-400 text-sky-300 hover:text-white shadow-[0_0_16px_rgba(14,165,233,0.25)]",
          icon: "🚚",
          text: "Advance → SHIPPED",
        };
      case "DELIVERED":
        return {
          className:
            "bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 border border-emerald-400/40 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.35)]",
          icon: "🎁",
          text: "Advance → DELIVERED",
        };
      default:
        return {
          className:
            "bg-[#14141C] hover:bg-[#1C1C26] border border-white/10 text-stone-300",
          icon: "→",
          text: `Advance → ${nextStatus}`,
        };
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

  const getNextStatus = (currentStatus) => {
    const progression = {
      PLACED: "CONFIRMED",
      CONFIRMED: "SHIPPED",
      SHIPPED: "DELIVERED",
    };
    return progression[currentStatus] || null;
  };

  return (
    <div className="min-h-screen bg-[#070709] text-stone-200 selection:bg-[#CCA46B]/30 selection:text-[#E5C07B]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#CCA46B] animate-pulse" />
              <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[#CCA46B]">
                Purchase History
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-white">
              My Orders
            </h1>
            {!loading && !error && (
              <p className="text-stone-400 mt-1 text-xs sm:text-sm font-light">
                {orders.length} order{orders.length !== 1 ? "s" : ""} placed to date.
              </p>
            )}
          </div>

          <Link
            to="/products"
            className="self-start sm:self-auto inline-flex items-center gap-2 bg-[#14141C] hover:bg-[#1E1E28] border border-white/10 text-stone-300 hover:text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#CCA46B]/20 border-t-[#CCA46B] animate-spin mb-4" />
            <p className="text-sm font-medium text-stone-400 tracking-wider">
              Loading your purchase history...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-300 text-sm font-medium mb-1">Unable to load orders</p>
            <p className="text-stone-500 text-xs mb-5">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-[#14141C] hover:bg-[#1E1E28] border border-white/10 text-stone-200 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center bg-[#0E0E14] border border-white/[0.06] rounded-2xl p-10">
            <div className="w-20 h-20 rounded-2xl bg-[#14141C] border border-white/[0.06] flex items-center justify-center mb-6 text-3xl">
              📦
            </div>
            <h2 className="text-white text-xl font-medium mb-2">
              You have not placed any orders yet.
            </h2>
            <p className="text-stone-400 text-sm font-light mb-8 max-w-xs">
              When you purchase items from your cart, they will appear here.
            </p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 text-black font-semibold text-xs uppercase tracking-[1.5px] px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(204,164,107,0.25)] flex items-center gap-2"
            >
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              );

              const nextStatus = getNextStatus(order.status);
              const isUpdating = updatingStatusId === order._id;
              const statusBadge = getStatusBadge(order.status);
              const btnConfig = nextStatus ? getAdvanceButtonConfig(nextStatus) : null;
              const currentStageIdx = getStageIndex(order.status);

              return (
                <div
                  key={order._id}
                  className="bg-[#0E0E14] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl p-6 shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-white font-mono text-sm sm:text-base font-semibold">
                          Order #{order._id}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-xs font-semibold tracking-wide ${statusBadge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} animate-pulse`} />
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-stone-400 text-xs mt-1">Placed on {formattedDate}</p>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-stone-400">Total</p>
                        <p className="text-[#E5C07B] font-bold text-lg">
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {nextStatus ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order._id, nextStatus)}
                          disabled={isUpdating}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50 ${btnConfig.className}`}
                          title={`Simulate advancing status to ${nextStatus}`}
                        >
                          {isUpdating ? (
                            <>
                              <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <span>{btnConfig.icon}</span>
                              <span>{btnConfig.text}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>✓ Fulfilled</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="my-5 p-4 rounded-xl bg-[#14141C]/60 border border-white/[0.04]">
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

                  <div className="py-2 divide-y divide-white/[0.03]">
                    {order.items?.map((item) => (
                      <div
                        key={item._id || item.product}
                        className="py-3 first:pt-0 last:pb-0 flex items-center gap-4"
                      >
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
                          <p className="text-white text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-stone-400 text-xs">
                            {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-stone-300">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400">
                    <div>
                      {order.shippingAddress && (
                        <span>
                          Ship to: <strong className="text-stone-300">{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city}, {order.shippingAddress.state})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {getPaymentBadge(order.paymentStatus)}
                      <Link
                        to={`/order-success/${order._id}`}
                        className="text-[#CCA46B] hover:text-[#E5C07B] font-semibold transition-colors flex items-center gap-1 group"
                      >
                        <span>View Receipt</span>
                        <span className="transition-transform group-hover:translate-x-0.5">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
