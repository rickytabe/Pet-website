import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContent";
import { Home } from "./pages/public/Home";
import { Login } from "./pages/public/Login";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Register } from "./pages/public/Register";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Profile } from "./pages/protected/Profile";
import { Cart } from "./components/cart/Cart";
import { Footer } from "./components/layout/Footer";
import { toast, ToastContainer } from "react-toastify";
import { Navbar } from "./components/layout/Navbar";

export const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  const handleSearch = () => {
    toast.success("Searching...");
    // Add actual search logic if needed
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = cartTotal * 0.07;
  const discount = cart.length >= 3 ? cartTotal * 0.1 : 0;

  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" 
        toastStyle={{
          fontSize: "20px",
          fontWeight: 500,
        }}
      />
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              onOpenCart={() => setIsCartOpen(true)}
            />

            <main className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                    />
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Cart
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              tax={tax}
              discount={discount}
            />

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
