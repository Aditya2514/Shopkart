import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, totalCount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (user?.name && !formData.fullName) {
      setFormData((prev) => ({ ...prev, fullName: user.name }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (paymentError) {
      setPaymentError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    const cleanPincode = formData.pincode.trim();
    if (!cleanPincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(cleanPincode)) {
      newErrors.pincode = "Pincode must contain 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentVerification = async (verifyPayload) => {
    try {
      const res = await api.post("/orders/verify-payment", verifyPayload);
      if (res.data.success) {
        clearCart();
        navigate(`/order-success/${res.data.order._id}`);
      } else {
        setPaymentError(res.data.message || "Payment verification failed");
      }
    } catch (err) {
      setPaymentError(
        err.response?.data?.message || "Payment verification failed on the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      setPaymentError("Your cart is empty. Please add items before checking out.");
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: formData.addressLine1.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
      };

      const { data } = await api.post("/orders/create-payment-order", orderPayload);

      if (!data.success) {
        setPaymentError(data.message || "Could not initialize checkout order");
        setSubmitting(false);
        return;
      }

      const isLoaded = await loadRazorpayScript();

      if (!isLoaded || !window.Razorpay) {
        setPaymentError(
          "Razorpay SDK could not be loaded from CDN. Please check your internet connection."
        );
        setSubmitting(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: `Order #${data.shopKartOrderId.slice(-6)}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: formData.fullName.trim(),
          contact: formData.phone.trim(),
          email: user?.email || "",
        },
        theme: {
          color: "#CCA46B",
        },
        handler: async (response) => {
          await handlePaymentVerification({
            shopKartOrderId: data.shopKartOrderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        setPaymentError(
          `Payment failed: ${response.error?.description || "Transaction cancelled"}. Your cart has not been cleared. Please try again.`
        );
        setSubmitting(false);
      });

      rzp.open();
    } catch (err) {
      setPaymentError(
        err.response?.data?.message || "Failed to initialize order checkout."
      );
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#070709] text-stone-200">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#0E0E14] border border-white/[0.06] flex items-center justify-center mx-auto mb-6 text-3xl">
            🛍️
          </div>
          <h1 className="text-3xl font-editorial text-white mb-3">Your Cart is Empty</h1>
          <p className="text-stone-400 text-sm mb-8">
            You cannot proceed to checkout without items in your shopping bag.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] text-black font-semibold text-xs uppercase tracking-[1.5px] px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(204,164,107,0.25)]"
          >
            <span>Browse Products</span>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-stone-200 selection:bg-[#CCA46B]/30 selection:text-[#E5C07B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#CCA46B] animate-pulse" />
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[#CCA46B]">
              Secure Purchase
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-white">
            Checkout
          </h1>
          <p className="text-stone-400 mt-1 text-xs sm:text-sm font-light">
            Provide delivery details and complete payment via Razorpay Test Mode.
          </p>
        </div>

        {paymentError && (
          <div className="mb-8 bg-rose-950/40 border border-rose-500/50 rounded-2xl p-5 text-rose-200 text-sm flex items-start justify-between gap-3 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-rose-300 text-xs uppercase tracking-wider mb-0.5">Payment Verification Alert</p>
                <p className="text-rose-100 text-xs sm:text-sm">{paymentError}</p>
                <p className="text-rose-300/80 text-[11px] mt-1">If using test cards, 3DS mock popup may stall in browser. Try selecting <strong>Netbanking</strong> in the checkout window for instant verification.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPaymentError("")}
              className="text-rose-400 hover:text-rose-200 text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-[#0E0E14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-full bg-[#CCA46B]/15 text-[#CCA46B] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-white text-lg font-medium">Shipping Address</h2>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full bg-[#14141C] border ${errors.fullName ? "border-rose-500" : "border-white/10"
                    } focus:border-[#CCA46B] text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors`}
                />
                {errors.fullName && (
                  <p className="text-rose-400 text-xs mt-1.5">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`w-full bg-[#14141C] border ${errors.phone ? "border-rose-500" : "border-white/10"
                    } focus:border-[#CCA46B] text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors`}
                />
                {errors.phone && (
                  <p className="text-rose-400 text-xs mt-1.5">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
                  Street Address / House No. <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="e.g. Flat 402, Royal Palms, MG Road"
                  className={`w-full bg-[#14141C] border ${errors.addressLine1 ? "border-rose-500" : "border-white/10"
                    } focus:border-[#CCA46B] text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors`}
                />
                {errors.addressLine1 && (
                  <p className="text-rose-400 text-xs mt-1.5">{errors.addressLine1}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
                    City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                    className={`w-full bg-[#14141C] border ${errors.city ? "border-rose-500" : "border-white/10"
                      } focus:border-[#CCA46B] text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors`}
                  />
                  {errors.city && (
                    <p className="text-rose-400 text-xs mt-1.5">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
                    State <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Karnataka"
                    className={`w-full bg-[#14141C] border ${errors.state ? "border-rose-500" : "border-white/10"
                      } focus:border-[#CCA46B] text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors`}
                  />
                  {errors.state && (
                    <p className="text-rose-400 text-xs mt-1.5">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
                    Pincode <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="560001"
                    maxLength={6}
                    className={`w-full bg-[#14141C] border ${errors.pincode ? "border-rose-500" : "border-white/10"
                      } focus:border-[#CCA46B] text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors`}
                  />
                  {errors.pincode && (
                    <p className="text-rose-400 text-xs mt-1.5">{errors.pincode}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-[2px] py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,164,107,0.25)] cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      <span>Opening Razorpay Checkout...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay with Razorpay</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="w-full p-3 rounded-xl bg-[#14141C]/80 border border-emerald-500/20 flex items-start gap-2.5 text-xs">
                  <span className="text-emerald-400 text-sm shrink-0 mt-0.5">⚡</span>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    <strong className="text-emerald-400">Instant Test Mode Tip:</strong> In the Razorpay modal, select <strong className="text-white">Netbanking</strong> (e.g. SBI/HDFC/PNB) and click <strong className="text-emerald-400">[ Success ]</strong> for immediate 2-second payment verification without popup blockers!
                  </p>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#0E0E14] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                <h2 className="text-white text-lg font-medium">Order Summary</h2>
                <span className="text-xs text-stone-400 font-mono">
                  {totalCount} item{totalCount !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="divide-y divide-white/[0.04] max-h-64 overflow-y-auto pr-1 mb-5">
                {cartItems.map((item) => {
                  const p = item.product;
                  const itemTotal = (p?.price || 0) * (item.quantity || 1);
                  return (
                    <div key={p?._id || item._id} className="py-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#14141C] border border-white/10 overflow-hidden shrink-0">
                        {p?.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
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
                          {p?.name}
                        </p>
                        <p className="text-xs text-stone-400">
                          Qty: {item.quantity} × ₹{p?.price?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-stone-200">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 pt-3 border-t border-white/[0.06] text-sm">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Payment Gateway</span>
                  <span className="text-amber-400 font-mono text-xs">Razorpay Test</span>
                </div>
                <div className="border-t border-white/[0.08] pt-4 flex justify-between items-baseline">
                  <span className="text-white font-semibold text-base">Total Payable</span>
                  <span className="text-2xl font-bold text-[#E5C07B]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-3.5 rounded-xl bg-[#14141C] border border-white/[0.06] flex items-center gap-3 text-stone-400 text-xs">
                <div className="w-8 h-8 rounded-lg bg-[#CCA46B]/10 text-[#CCA46B] flex items-center justify-center shrink-0">
                  🛡️
                </div>
                <div>
                  <p className="text-stone-200 font-medium">Razorpay Test Mode</p>
                  <p className="text-[11px] text-stone-400">
                    Use Razorpay test payment methods (Netbanking/UPI/Cards). No real funds charged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
