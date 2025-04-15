import { FaHeart, FaShoppingCart, FaFire } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

type TabType<T extends readonly string[]> = T[number];

interface TabsProps<T extends readonly string[]> {
  tabs: T;
  activeTab: TabType<T>;
  setActiveTab: (tab: TabType<T>) => void;
  searchTerm?: string;
  totalResults?: number;
  filteredResults?: number;
  cartCount?: number;
  favoritesCount?: number;
  showFavorites?: boolean;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;
  onToggleFavorites?: () => void;
  onOpenCart?: () => void;
}

export function Tabs<T extends readonly string[]>({
  tabs,
  activeTab,
  setActiveTab,
  searchTerm = "",
  totalResults = 0,
  filteredResults = 0,
  cartCount = 0,
  favoritesCount = 0,
  showFavorites = false,
  minPrice,
  maxPrice,
  onPriceChange,
  onToggleFavorites,
  onOpenCart,
}: TabsProps<T>) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || "");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePriceUpdate = () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    
    debounceTimeout.current = setTimeout(() => {
      const min = localMinPrice ? Math.max(0, parseInt(localMinPrice)) : 0;
      const max = localMaxPrice ? Math.max(min, parseInt(localMaxPrice)) : Infinity;
      onPriceChange?.(min, max);
    }, 500);
  };

  useEffect(() => {
    handlePriceUpdate();
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [localMinPrice, localMaxPrice]);

  const handleResetPrices = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onPriceChange?.(0, Infinity);
  };

  return (
    <div className="bg-white border-b shadow-sm overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <div className="flex-1 flex overflow-x-auto scrollbar-hide min-w-0">
              <div className="flex items-center gap-2 flex-nowrap min-w-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm sm:text-base whitespace-nowrap font-medium rounded-full flex-shrink-0 ${
                      activeTab === tab
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onToggleFavorites}
              className={`relative flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full ${
                showFavorites
                  ? "bg-pink-100 text-pink-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <div className="relative sm:hidden">
                <FaHeart className={showFavorites ? "text-pink-500" : "text-gray-400"} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block relative">
                <div className="flex items-center gap-2">
                  <FaHeart className={showFavorites ? "text-pink-500" : "text-gray-400"} />
                  <span className="hidden sm:inline">Favorites</span>
                  {favoritesCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {favoritesCount}
                    </span>
                  )}
                </div>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop Price Filter */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                <span className="text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  className="w-20 px-2 py-1 bg-transparent text-sm focus:outline-none"
                  min="0"
                />
                <span className="text-gray-400 mx-1">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="w-20 px-2 py-1 bg-transparent text-sm focus:outline-none"
                  min={localMinPrice || "0"}
                />
                {(localMinPrice || localMaxPrice) && (
                  <button
                    onClick={handleResetPrices}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Price Filter */}
            <div className="sm:hidden flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
              <span className="text-gray-500 text-sm">$</span>
              <input
                type="number"
                placeholder="Min"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="w-12 px-1 py-1 bg-transparent text-sm focus:outline-none"
                min="0"
              />
              <span className="text-gray-400 mx-1">-</span>
              <input
                type="number"
                placeholder="Max"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="w-12 px-1 py-1 bg-transparent text-sm focus:outline-none"
                min={localMinPrice || "0"}
              />
              {(localMinPrice || localMaxPrice) && (
                <button
                  onClick={handleResetPrices}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            <div className="hidden sm:block text-gray-600 text-sm whitespace-nowrap">
              {searchTerm ? (
                <span>
                  Showing {filteredResults} of {totalResults}
                </span>
              ) : (
                <span>{totalResults} available</span>
              )}
            </div>

            <button
              onClick={onOpenCart}
              className="relative p-1 sm:p-2 text-gray-700 hover:text-blue-600 flex-shrink-0"
            >
              <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {cartCount > 0 && cartCount < 3 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-2 sm:p-3 mb-4 flex items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 truncate">
              <FaFire className="flex-shrink-0" />
              <span className="truncate">Get 10% off with 3+ dogs!</span>
            </div>
            <button
              onClick={onOpenCart}
              className="bg-white text-orange-600 px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
            >
              View Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}