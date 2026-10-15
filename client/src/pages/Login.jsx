import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import authHeroImg from "../assets/shop_luxury_hero.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/customers/login", {
        email: form.email,
        password: form.password,
      });
      const meRes = await api.get("/customers/me");
      setUser(meRes.data);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070709] text-stone-200 selection:bg-[#CCA46B]/30 selection:text-[#E5C07B]">
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden flex-col justify-between p-12 bg-[#0A0A0F]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url(${authHeroImg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/40 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#070709]/30 to-[#070709]" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#CCA46B] to-[#99733E] flex items-center justify-center text-black font-bold text-sm shadow-[0_0_20px_rgba(204,164,107,0.35)]">
              SK
            </div>
            <span className="text-2xl font-editorial tracking-tight text-white">
              Shop<span className="text-[#CCA46B] italic font-semibold">Kart</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-xs uppercase tracking-[3px] font-semibold text-[#CCA46B] mb-2">
            All-In-One Marketplace
          </p>
          <h2 className="text-3xl font-editorial font-normal text-white leading-tight mb-3">
            Everything, Delivered.
          </h2>
          <p className="text-sm text-stone-300 font-light leading-relaxed">
            From daily fresh groceries and modern electronics to fashion and home essentials — discover millions of products curated with excellence.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 sm:px-12 py-12 relative">
        <div className="absolute w-96 h-96 rounded-full bg-[#CCA46B]/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#0E0E14] border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#CCA46B] animate-pulse" />
            <p className="text-xs font-semibold tracking-[3px] uppercase text-[#CCA46B]">
              Welcome Back
            </p>
          </div>

          <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-white mb-2">
            Sign in to ShopKart
          </h2>
          <p className="text-xs text-stone-400 mb-8">
            Access your orders, daily essentials, and member benefits
          </p>

          {error && (
            <div className="flex items-center gap-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs rounded-xl px-4 py-3.5 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-400 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-[#14141C] border border-white/[0.08] focus:border-[#CCA46B] focus:ring-1 focus:ring-[#CCA46B] rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium uppercase tracking-wider text-stone-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#14141C] border border-white/[0.08] focus:border-[#CCA46B] focus:ring-1 focus:ring-[#CCA46B] rounded-xl pl-10 pr-11 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-[#CCA46B] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.94 17.94A10.07 10.07 0 0112 20c-5.523 0-10-4.477-10-8 0-1.274.402-2.46 1.06-3.47M6.53 6.53A9.97 9.97 0 0112 4c5.523 0 10 4.477 10 8a9.96 9.96 0 01-2.343 6.343M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-[2px] py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,164,107,0.25)] hover:shadow-[0_0_30px_rgba(204,164,107,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Sign In</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[2px]">
              <span className="bg-[#0E0E14] px-3 text-stone-500">New to ShopKart?</span>
            </div>
          </div>

          <p className="text-center text-xs text-stone-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              replace
              className="text-[#CCA46B] hover:text-[#E5C07B] font-semibold transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
