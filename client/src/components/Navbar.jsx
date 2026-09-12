import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
    } catch (err) {
      console.log(err);
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link to="/home" className="text-2xl font-bold text-white tracking-tight">
        Shop<span className="text-indigo-400">Kart</span>
      </Link>

      {/* Logout Button */}
      <button
        id="logout-btn"
        onClick={handleLogout}
        className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-400 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
      >
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
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
          />
        </svg>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
