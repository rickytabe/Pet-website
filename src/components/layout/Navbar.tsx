import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaPaw,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { SearchBar } from "../common/SearchBar";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContent";

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: () => void;
  onOpenCart: () => void;
}

export const Navbar = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  onOpenCart,
}: NavbarProps) => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* Sticky Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-xl md:text-2xl font-bold text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaPaw className="mr-2" />
                Happy Paws
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                placeholder="Search dogs by breed or name..."
                icon={<FaSearch className="w-5 h-5" />}
                className="max-w-xl flex-grow mr-4"
                color="blue-500"
                textColor="white"
                stroke="white"
              />

              <div className="flex items-center space-x-6">
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {user ? (
                  <>
                    <button
                      onClick={onOpenCart}
                      className="relative text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      {cart.length > 0 && (
                        <span className="absolute -top-2 -right-3 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                          {cart.length}
                        </span>
                      )}
                    </button>
                    <Link
                      to="/profile"
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <FaUser className="mr-1" /> Account
                    </Link>
                  </>
                ) : (
                  <div className="space-x-4">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-blue-500 border rounded-md border-blue-500 font-bold hover:text-white hover:bg-blue-500 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 border rounded-md bg-blue-500 text-white font-bold hover:text-blue-600 hover:bg-white hover:border-blue-600 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-30 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Content */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaPaw className="mr-2" />
              Happy Paws
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            placeholder="Search..."
            icon={<FaSearch className="w-5 h-5" />}
            className="w-full mb-6"
            color="blue"
            textColor="white"
            stroke="white"
          />

          <div className="space-y-2">
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="block p-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="mr-3" /> Profile
                </Link>
                <button
                  onClick={() => {
                    onOpenCart();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                >
                  <FaShoppingCart className="mr-3" />
                  Cart
                  {cart.length > 0 && (
                    <span className="ml-auto bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
                      {cart.length}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block p-3 text-gray-700 hover:bg-blue-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block p-3 text-blue-600 hover:bg-blue-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};