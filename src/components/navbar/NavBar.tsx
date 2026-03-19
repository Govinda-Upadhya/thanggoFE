import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import logo from "../../assets/logo.svg";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(64); // Default height (h-16 = 64px)
  const location = useLocation();
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Measure navbar height after initial render
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update navbar height when mobile menu opens/closes
  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(!isOpen);
      // Reset animation state after transition completes
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    const baseClasses =
      "font-semibold transition-all duration-300 px-3 py-2 rounded-lg relative group";

    if (isScrolled || !isHomePage) {
      return `${baseClasses} ${
        isActive
          ? "text-emerald-600 bg-emerald-50 shadow-sm"
          : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
      }`;
    } else {
      return `${baseClasses} ${
        isActive
          ? "text-white bg-white/20 shadow-sm"
          : "text-white/90 hover:text-white hover:bg-white/20"
      }`;
    }
  };

  const getMobileNavLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }): string => {
    return `block font-semibold transition-all duration-300 py-3 px-4 rounded-lg transform transition-transform ${
      isActive
        ? "text-emerald-600 bg-emerald-50 scale-105"
        : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 hover:scale-105"
    }`;
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      <nav
        ref={navbarRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHomePage
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-3 group relative"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={logo}
                  alt="ThangGo Logo"
                  className="h-10 w-10 object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                />
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 -left-16 bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-12 group-hover:animate-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              <span
                className={`text-2xl font-bold transition-all duration-500 ${
                  isScrolled || !isHomePage ? "text-emerald-700" : "text-white"
                } group-hover:text-emerald-600 relative`}
              >
                ThangGo
                {/* Underline animation */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-500 group-hover:w-full"></span>
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/aboutus" className={getNavLinkClass}>
                About Us
                {/* Hover underline effect */}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:left-0 group-hover:w-full"></span>
              </NavLink>
              <NavLink to="/contactus" className={getNavLinkClass}>
                Contact Us
                {/* Hover underline effect */}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:left-0 group-hover:w-full"></span>
              </NavLink>
              <NavLink to="/feedback" className={getNavLinkClass}>
                FeedBack
                {/* Hover underline effect */}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:left-0 group-hover:w-full"></span>
              </NavLink>
              <div
                className={`h-6 w-px mx-2 transition-all duration-500 ${
                  isScrolled || !isHomePage ? "bg-gray-300" : "bg-white/40"
                }`}
              ></div>

              <NavLink
                to="/admin/signin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-500 transform hover:scale-105 shadow-md hover:shadow-lg relative overflow-hidden group ${
                  isScrolled || !isHomePage
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                }`}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -left-16 bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-12 group-hover:animate-shine opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <LogIn className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Admin Login</span>
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-md transition-all duration-500 transform hover:scale-110 ${
                isScrolled || !isHomePage
                  ? "text-gray-700 hover:bg-emerald-50"
                  : "text-white hover:bg-white/20"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 transition-transform duration-500 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-xl px-4 pt-2 pb-6 space-y-2">
            <NavLink
              to="/aboutus"
              className={getMobileNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contactus"
              className={getMobileNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </NavLink>
            <NavLink to="/feedback" className={getMobileNavLinkClass}>
              FeedBack
              {/* Hover underline effect */}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:left-0 group-hover:w-full"></span>
            </NavLink>

            <div className="border-t border-gray-200 my-2 transition-all duration-500"></div>

            <NavLink
              to="/admin/signin"
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 mt-4 transform hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Admin Login
            </NavLink>
          </div>
        </div>

        {/* Animation styles */}
        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shine {
            0% {
              left: -100%;
            }
            100% {
              left: 200%;
            }
          }
          
          .animate-shine {
            animation: shine 1.5s ease-in-out;
          }
          
          /* Staggered animation for mobile menu items */
          .md\\:hidden a {
            animation: slideDown 0.4s ease-out;
          }
          
          .md\\:hidden a:nth-child(1) {
            animation-delay: 0.1s;
          }
          
          .md\\:hidden a:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .md\\:hidden a:nth-child(3) {
            animation-delay: 0.3s;
          }
        `}</style>
      </nav>

      {/* Spacer to prevent content overlap - Only show on non-home pages */}
      {!isHomePage && (
        <div style={{ height: `${navbarHeight}px` }} className="w-full"></div>
      )}
    </>
  );
};

export default Navbar;
