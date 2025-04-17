// components/cart/Cart.tsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartItem } from "./CartItem";
import { Checkout } from "./Checkout";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  tax: number;
  discount: number;
}

export const Cart = ({ isOpen, onClose, tax, discount }: CartProps) => {
  const { user } = useAuth();
  const { cart, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + tax - discount;
  
  const Oncheckout = () => {
    if (!user) {
      toast.info("Please login to proceed to checkout");
      onClose(); 
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    setShowCheckout(true);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleCheckoutSuccess = () => {
    clearCart();
    onClose();
    toast.success("Order placed successfully! 🎉");
    setShowCheckout(false);
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {showCheckout ? "Checkout" : "Your Cart"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {showCheckout ? (
              <Checkout
                total={total}
                onSuccess={handleCheckoutSuccess}
                onBack={() => setShowCheckout(false)}
              />
            ) : (
              <>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Your cart is empty
                  </p>
                ) : (
                  <>
                    {cart.map((dog) => (
                      <CartItem
                        key={dog.id}
                        dog={dog}
                        onRemove={() => removeFromCart(dog.id)}
                      />
                    ))}
                    
                    {/* Order Summary */}
                    <div className="space-y-2 mt-6 pt-4 border-t">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (7%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Discount:</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
                      onClick={Oncheckout}
                    >
                      {user ? "Proceed to Checkout" : "Login to Checkout"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};