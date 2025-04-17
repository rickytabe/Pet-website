import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaPaw,
  FaSearch,
  FaBars,
  FaTimes,
  FaAd,
  FaHome,
} from "react-icons/fa";
import { SearchBar } from "../common/SearchBar";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

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
  const location = useLocation();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isMenuOpen]);

  // Active link style checker
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Sticky Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
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
                <Link 
                  to='/' 
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <FaHome className="mr-2 w-4 h-4" /> Home
                </Link>
                
                {user?.role === "admin" && ( 
                  <Link
                    to="/admin"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin') 
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <FaAd className="mr-2 w-4 h-4" /> Admin
                  </Link>
                )}

                {user ? (
                  <>
                    <button
                      onClick={onOpenCart}
                      className="relative flex items-center p-3 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FaShoppingCart className="mr-2 w-4 h-4" /> Cart
                      {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                          {cart.length}
                        </span>
                      )}
                    </button>
                    <Link
                      to="/profile"
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/profile') 
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <FaUser className="mr-2 w-4 h-4" /> Account
                    </Link>
                  </>
                ) : (
                  <div className="flex space-x-3">
                    <Link
                      to="/login"
                      className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        isActive('/login')
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        isActive('/register')
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
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
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 p-2">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-blue-600 hover:text-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaPaw className="mr-2" />
              Happy Paws
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="px-2 mb-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearch}
              placeholder="Search..."
              icon={<FaSearch className="w-4 h-4" />}
              className="w-full"
              color="blue"
              textColor="white"
              stroke="white"
            />
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="space-y-1">
              <Link
                to="/"
                className={`flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                 <FaHome className="mr-2 w-4 h-4" />Home
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive('/admin')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaAd className="mr-2" /> Admin
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive('/profile')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-3" /> My Account
                  </Link>
                  <button
                    onClick={() => {
                      onOpenCart();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      isActive('/cart')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <FaShoppingCart className="mr-3" />
                    My Cart
                    {cart.length > 0 && (
                      <span className="ml-auto bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
                        {cart.length}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-2 mt-4">
                  <Link
                    to="/login"
                    className={`block px-4 py-3 rounded-md text-base font-medium border transition-colors ${
                      isActive('/login')
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`block px-4 py-3 rounded-md text-base font-medium text-center transition-colors ${
                      isActive('/register')
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};