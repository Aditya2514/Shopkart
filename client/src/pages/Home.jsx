import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#070709] text-stone-200 selection:bg-[#CCA46B]/30 selection:text-[#E5C07B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CCA46B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#CCA46B]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[#0E0E14] border border-white/[0.08] hover:border-[#CCA46B]/25 rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#CCA46B]/10 border border-[#CCA46B]/20">
                <span className="w-2 h-2 rounded-full bg-[#CCA46B] animate-pulse" />
                <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[#CCA46B]">
                  Customer Account Overview
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-white mt-2">
                Welcome back,{" "}
                <span className="italic text-[#E5C07B]">
                  {user?.fullName?.split(" ")[0]}!
                </span>{" "}
                👋
              </h1>
              <p className="text-stone-400 mt-2.5 text-sm sm:text-base font-light leading-relaxed">
                Manage your verified customer credentials, review account benefits, and explore our collection of curated products.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <div className="bg-[#14141C] border border-white/[0.06] rounded-2xl px-4 py-3 text-center min-w-[120px]">
                <span className="text-xs text-stone-400 uppercase tracking-wider block font-medium">Status</span>
                <span className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
              <div className="bg-[#14141C] border border-white/[0.06] rounded-2xl px-4 py-3 text-center min-w-[120px]">
                <span className="text-xs text-stone-400 uppercase tracking-wider block font-medium">Tier</span>
                <span className="text-sm font-semibold text-[#E5C07B] mt-0.5 block">ShopKart Member</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-[#0E0E14] border border-white/[0.08] hover:border-[#CCA46B]/30 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#D9A862] via-[#CCA46B] to-[#B88E52] text-black font-bold flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(204,164,107,0.3)] shrink-0">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#CCA46B]/15 text-[#CCA46B] font-semibold tracking-wider uppercase border border-[#CCA46B]/20">
                        Verified Member
                      </span>
                    </div>
                    <h2 className="text-2xl font-editorial font-normal text-white mt-1">
                      {user?.fullName}
                    </h2>
                    <p className="text-xs text-stone-400 font-light">ShopKart Customer</p>
                  </div>
                </div>

                <div className="border-t border-white/[0.08] mb-6" />

                <div className="space-y-3.5">
                  <div className="p-4 rounded-2xl bg-[#14141C] border border-white/[0.05] hover:border-[#CCA46B]/30 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#CCA46B]/10 border border-[#CCA46B]/20 text-[#CCA46B] flex items-center justify-center shrink-0">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
                          Full Name
                        </p>
                        <p className="text-sm text-stone-100 font-medium truncate mt-0.5">
                          {user?.fullName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#14141C] border border-white/[0.05] hover:border-[#CCA46B]/30 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#CCA46B]/10 border border-[#CCA46B]/20 text-[#CCA46B] flex items-center justify-center shrink-0">
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
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
                          Email Address
                        </p>
                        <p className="text-sm text-stone-100 font-medium truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#14141C] border border-white/[0.05] hover:border-[#CCA46B]/30 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#CCA46B]/10 border border-[#CCA46B]/20 text-[#CCA46B] flex items-center justify-center shrink-0">
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
                          Phone Number
                        </p>
                        <p className="text-sm text-stone-100 font-medium truncate mt-0.5">
                          {user?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  256-Bit SSL Encrypted
                </span>
                <span>Protected Account</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#0E0E14] border border-white/[0.08] hover:border-[#CCA46B]/30 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold tracking-[2px] uppercase text-[#CCA46B]">
                  Catalog Hub
                </span>
                <span className="text-xs text-stone-400">12 Live Products</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-white">
                Discover Curated Collections
              </h2>
              <p className="text-stone-300 text-sm font-light leading-relaxed mt-2 mb-6">
                Browse our wide selection of premium electronics, contemporary fashion, bestselling literature, home decor, and gourmet groceries.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                <Link
                  to="/products"
                  className="bg-[#14141C] hover:bg-[#1A1A24] border border-white/[0.05] hover:border-[#CCA46B]/40 p-3 rounded-xl text-center transition-all group"
                >
                  <span className="text-lg block mb-1">🎧</span>
                  <span className="text-xs font-medium text-stone-300 group-hover:text-white">Electronics</span>
                </Link>
                <Link
                  to="/products"
                  className="bg-[#14141C] hover:bg-[#1A1A24] border border-white/[0.05] hover:border-[#CCA46B]/40 p-3 rounded-xl text-center transition-all group"
                >
                  <span className="text-lg block mb-1">👟</span>
                  <span className="text-xs font-medium text-stone-300 group-hover:text-white">Fashion</span>
                </Link>
                <Link
                  to="/products"
                  className="bg-[#14141C] hover:bg-[#1A1A24] border border-white/[0.05] hover:border-[#CCA46B]/40 p-3 rounded-xl text-center transition-all group"
                >
                  <span className="text-lg block mb-1">📚</span>
                  <span className="text-xs font-medium text-stone-300 group-hover:text-white">Books</span>
                </Link>
                <Link
                  to="/products"
                  className="bg-[#14141C] hover:bg-[#1A1A24] border border-white/[0.05] hover:border-[#CCA46B]/40 p-3 rounded-xl text-center transition-all group"
                >
                  <span className="text-lg block mb-1">☕</span>
                  <span className="text-xs font-medium text-stone-300 group-hover:text-white">Home</span>
                </Link>
                <Link
                  to="/products"
                  className="bg-[#14141C] hover:bg-[#1A1A24] border border-white/[0.05] hover:border-[#CCA46B]/40 p-3 rounded-xl text-center transition-all group col-span-2 sm:col-span-2"
                >
                  <span className="text-lg block mb-1">🍯</span>
                  <span className="text-xs font-medium text-stone-300 group-hover:text-white">Everyday Groceries</span>
                </Link>
              </div>

              <Link
                to="/products"
                className="w-full bg-gradient-to-r from-[#D9A862] via-[#CCA46B] to-[#B88E52] hover:brightness-110 active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-[2px] py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(204,164,107,0.3)] cursor-pointer"
              >
                <span>Explore Products Collection</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0E0E14] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-2xl mb-2">⚡</span>
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Fast Delivery</h3>
                  <p className="text-[11px] text-stone-400 font-light mt-1">Real-time doorstep order tracking</p>
                </div>
              </div>
              <div className="bg-[#0E0E14] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-2xl mb-2">🏷️</span>
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Exclusive Deals</h3>
                  <p className="text-[11px] text-stone-400 font-light mt-1">Special pricing on top products</p>
                </div>
              </div>
              <div className="bg-[#0E0E14] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-2xl mb-2">🛡️</span>
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Easy Returns</h3>
                  <p className="text-[11px] text-stone-400 font-light mt-1">Hassle-free 7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;