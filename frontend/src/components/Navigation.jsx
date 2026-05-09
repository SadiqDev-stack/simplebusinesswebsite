// components/Navigation.jsx
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ];

  // Check if user is admin or super
  const isAdmin = user?.role === "admin" || user?.role === "super";
  const isUser = user?.role === "user";

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧢</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sadiq Caps
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Admin Dashboard - Only visible to admin/super */}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* User Dashboard - Visible to ALL logged in users */}
                <Link
                  to="/user/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-medium"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && user.emailVerified ? (
              <>
                {/* Admin Dashboard - Only visible to admin/super on mobile */}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* User Dashboard - Visible to ALL logged in users on mobile */}
                <Link
                  to="/user/dashboard"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded transition-colors font-medium text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
