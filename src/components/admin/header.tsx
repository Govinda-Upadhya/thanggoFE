import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { base_url } from "../../types/ground";
import logo from "../../assets/logo.svg";

interface HeaderProps {
  active: string;
  setActive: (active: string) => void;
}

export default function Header({ active, setActive }: HeaderProps) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<{ name: string; profile: string }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await axios.get(`${base_url}/admin/getAdmin`, {
          withCredentials: true,
        });
        setAdmin(res.data);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    }
    fetchAdmin();
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSetActive = (newActive: string) => {
    setActive(newActive);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`bg-gradient-to-r from-green-700 to-emerald-600 text-white p-2 sm:p-4 sticky top-0 z-50 shadow-lg w-full transition-all duration-300 ${
        isScrolled ? "py-2 shadow-xl" : "py-4"
      }`}
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-around items-center gap-2">
        <div className="flex w-full sm:w-auto justify-between items-center">
          <NavLink to="/" className="flex items-center gap-2 text-white group">
            <div className="relative">
              <img
                src={logo}
                alt="ThangGo Logo"
                className="h-10 w-10 object-cover relative z-10 transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-2xl font-bold tracking-tighter group-hover:tracking-wide transition-all duration-300">
              Thang<span className="text-emerald-300">Go</span>
            </span>
          </NavLink>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-white focus:outline-none p-1 rounded-md bg-emerald-700 hover:bg-emerald-600 active:scale-95 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Admin Profile Section - Desktop */}
        {admin && (
          <div
            onClick={() => navigate("/admin/config")}
            className="hidden sm:flex items-center hover:cursor-pointer space-x-2 bg-emerald-800/60 py-1 px-3 rounded-full hover:bg-emerald-800 transition-colors duration-300 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-30 animate-ping group-hover:animate-none transition-opacity duration-300"></div>
              <img
                src={admin.profile}
                alt={admin.name}
                className="w-8 h-8 rounded-full object-cover relative z-10 border-2 border-emerald-400 group-hover:border-white transition-colors duration-300"
              />
            </div>
            <span className="text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
              {admin.name}
            </span>
          </div>
        )}

        {/* Navigation Menu */}
        <nav
          className={`w-full sm:w-auto overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 sm:max-h-96 sm:opacity-100"
          }`}
        >
          <ul className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-4 items-center py-4 sm:py-0">
            {/* Admin Profile Section - Mobile */}
            {admin && (
              <li className="w-full sm:hidden flex justify-center mb-2">
                <div
                  onClick={() => {
                    navigate("/admin/config");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 bg-emerald-800/60 py-1 px-3 rounded-full hover:bg-emerald-800 transition-colors duration-300 cursor-pointer group"
                >
                  <img
                    src={admin.profile}
                    alt={admin.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400 group-hover:border-white transition-colors duration-300"
                  />
                  <span className="text-sm font-medium group-hover:text-emerald-200 transition-colors duration-300">
                    {admin.name}
                  </span>
                </div>
              </li>
            )}

            <li className="w-full sm:w-auto">
              <button
                onClick={() => handleSetActive("dashboard")}
                className={`w-full sm:w-auto text-center py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                  active === "dashboard"
                    ? "bg-white text-emerald-700 font-bold shadow-lg"
                    : "bg-emerald-700/50 hover:bg-emerald-700 text-white"
                }`}
              >
                Dashboard
              </button>
            </li>
            <li className="w-full sm:w-auto">
              <button
                onClick={() => handleSetActive("booking")}
                className={`w-full sm:w-auto text-center py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                  active === "booking"
                    ? "bg-white text-emerald-700 font-bold shadow-lg"
                    : "bg-emerald-700/50 hover:bg-emerald-700 text-white"
                }`}
              >
                Bookings
              </button>
            </li>
            <li className="w-full sm:w-auto">
              <button
                onClick={() => handleSetActive("statistics")}
                className={`w-full sm:w-auto text-center py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                  active === "statistics"
                    ? "bg-white text-emerald-700 font-bold shadow-lg"
                    : "bg-emerald-700/50 hover:bg-emerald-700 text-white"
                }`}
              >
                Statistics
              </button>
            </li>
            <li className="w-full sm:w-auto">
              <button
                onClick={() => handleSetActive("addGround")}
                className={`w-full sm:w-auto text-center py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                  active === "addGround"
                    ? "bg-white text-emerald-700 font-bold shadow-lg"
                    : "bg-emerald-700/50 hover:bg-emerald-700 text-white"
                }`}
              >
                Add Ground
              </button>
            </li>
            <li className="w-full sm:w-auto">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="w-full sm:w-auto text-center py-2 px-4 rounded-lg bg-emerald-900 hover:bg-red-600 text-white font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
