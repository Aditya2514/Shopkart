import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0d0d14] via-[#12121f] to-[#0d0d14]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-14">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back,{" "}
            <span className="text-indigo-400">
              {user.fullName.split(" ")[0]}!
            </span>{" "}
            👋
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Here's your account information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-2xl font-bold text-indigo-300">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.fullName}
              </h2>
              <p className="text-slate-400 text-sm">ShopKart Customer</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-6" />

          {/* Info Fields */}
          <div className="space-y-5">
            {/* Full Name */}
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Full Name
                </p>
                <p className="text-white font-medium mt-0.5">{user.fullName}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-white font-medium mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Phone
                </p>
                <p className="text-white font-medium mt-0.5">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
