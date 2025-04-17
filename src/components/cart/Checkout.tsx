// components/cart/Checkout.tsx
import { useState, useMemo } from "react";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orders";
import { FaCcPaypal, FaCreditCard, FaMobile, FaSearch, FaGlobe } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import countries from "country-data";

interface CheckoutProps {
  total: number;
  onSuccess: () => void;
  onBack: () => void;
}

interface Country {
    name: string;
    alpha2: string;
    emoji?: string;
}

export const Checkout = ({ total, onSuccess, onBack }: CheckoutProps) => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "paypal" | "card">();
  const [dummyPhone, setDummyPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string } | null>(null);
  const [city, setCity] = useState("");
  
  const allCountries = useMemo(() => 
    (countries.countries.all as unknown as Country[])
      .filter(c => c.name && c.alpha2)
      .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const filteredCountries = useMemo(() =>
    allCountries.filter(country =>
      country.name.toLowerCase().includes(countryQuery.toLowerCase()) ||
      country.alpha2.toLowerCase().includes(countryQuery.toLowerCase()) // Changed from code to alpha2
    ),
    [countryQuery, allCountries]
  );

  const handleDummyPayment = async () => {
    if (!user || !selectedCountry || !city) return;
    
    const shippingAddress = `${city}, ${selectedCountry.name}`;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await createOrder({
          userId: user.uid,
          items: cart.map(dog => dog.id),
          total,
          paymentMethod: paymentMethod || "card",
          shippingAddress,
          status: "pending",
      });

      clearCart();
      onSuccess();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Button variant="secondary" onClick={onBack} className="mb-4">
        &larr; Back to Cart
      </Button>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800">Checkout Summary</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Shipping Information</h3>
          
          {/* Country Selector */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search country..."
                className="w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
            
            {countryQuery && (
              <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCountries.map((country: Country) => (
                  <button
                    key={country.alpha2}
                    onClick={() => {
                      setSelectedCountry({ name: country.name, code: country.alpha2 });
                      setCountryQuery("");
                    }}
                    className="w-full p-3 text-left hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <ReactCountryFlag
                      countryCode={country.alpha2}
                      svg
                      style={{ width: '1.5em', height: '1.5em' }}
                    />
                    <span>{country.name}</span>
                    <span className="text-gray-500 text-sm">{country.alpha2}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Country Display */}
          {selectedCountry && (
            <div className="p-3 bg-blue-50 rounded-lg flex items-center space-x-3">
              <ReactCountryFlag
                countryCode={selectedCountry.code}
                svg
                style={{ width: '1.5em', height: '1.5em' }}
              />
              <span className="font-medium">{selectedCountry.name}</span>
            </div>
          )}

          {/* City Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your city"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <FaGlobe className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
          
          {/* Payment Methods */}
          <div className="space-y-4">
            {/* MTN Mobile Money */}
            <div className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
              <button 
                onClick={() => setPaymentMethod("momo")}
                className="flex items-center justify-between w-full"
              >
                <span className="font-medium">MTN Mobile Money</span>
                <FaMobile className="text-2xl text-blue-500" />
              </button>

              {paymentMethod === "momo" && (
                <div className="mt-4 space-y-4">
                  <input
                    type="tel"
                    placeholder="Enter dummy phone number"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={dummyPhone}
                    onChange={(e) => setDummyPhone(e.target.value)}
                    required
                  />
                  <Button
                    loading={loading}
                    onClick={handleDummyPayment}
                    disabled={!dummyPhone || !selectedCountry || !city}
                    className="w-full"
                  >
                    Complete MoMo Payment
                  </Button>
                </div>
              )}
            </div>

            {/* PayPal */}
            <div className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
              <button 
                onClick={() => setPaymentMethod("paypal")}
                className="flex items-center justify-between w-full"
              >
                <span className="font-medium">PayPal</span>
                <FaCcPaypal className="text-2xl text-blue-500" />
              </button>

              {paymentMethod === "paypal" && (
                <div className="mt-4">
                  <Button
                    loading={loading}
                    onClick={handleDummyPayment}
                    disabled={!selectedCountry || !city}
                    className="w-full"
                  >
                    Complete PayPal Payment
                  </Button>
                </div>
              )}
            </div>

            {/* Credit Card */}
            <div className="p-4 border rounded-lg hover:border-blue-500 transition-colors">
              <button 
                onClick={() => setPaymentMethod("card")}
                className="flex items-center justify-between w-full"
              >
                <span className="font-medium">Credit/Debit Card</span>
                <FaCreditCard className="text-2xl text-blue-500" />
              </button>

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full p-3 border rounded-lg bg-gray-50 cursor-not-allowed"
                      value="4242 4242 4242 4242"
                      readOnly
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="p-3 border rounded-lg bg-gray-50 cursor-not-allowed"
                        value="12/34"
                        readOnly
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="p-3 border rounded-lg bg-gray-50 cursor-not-allowed"
                        value="123"
                        readOnly
                      />
                    </div>
                  </div>
                  <Button
                    loading={loading}
                    onClick={handleDummyPayment}
                    disabled={!selectedCountry || !city}
                    className="w-full"
                  >
                    Complete Card Payment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};