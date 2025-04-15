import { useEffect, useState } from "react";
import { Hero } from "../../components/layout/Hero";
import { Tabs } from "../../components/layout/Tabs";
import { DogCard } from "../../components/dogs/DogCard";
import { Loader } from "../../components/common/Loader";
import { Cart } from "../../components/cart/Cart";
import { collection, getDocs, query, where, getCountFromServer, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Dog } from "../../types/user";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContent";
import { SearchBar } from "../../components/common/SearchBar";
import { useAuth } from "../../context/AuthContext";

const TABS = ["All", "Available", "Puppies", "Adults"] as const;

interface HomeProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const Home = ({ searchTerm, setSearchTerm }: HomeProps) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { cart, addToCart } = useCart();
  const { user } = useAuth();
  const [priceFilter, setPriceFilter] = useState<{ min?: number; max?: number }>({});

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, "userFavorites", user.uid),
      (doc) => {
        if (doc.exists()) {
          setFavorites(doc.data().dogIds || []);
        } else {
          setFavorites([]);
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchTotalCount = async () => {
      let q = query(collection(db, "dogs"));

      if (activeTab === "Available") {
        q = query(q, where("isAvailable", "==", true));
      } else if (activeTab === "Puppies") {
        q = query(q, where("age", "<=", 1));
      } else if (activeTab === "Adults") {
        q = query(q, where("age", ">", 1));
      }

      const snapshot = await getCountFromServer(q);
      setTotalResults(snapshot.data().count);
    };
    fetchTotalCount();
  }, [activeTab]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        let q = query(collection(db, "dogs"));

        if (activeTab === "Available") {
          q = query(q, where("isAvailable", "==", true));
        } else if (activeTab === "Puppies") {
          q = query(q, where("age", "<=", 1));
        } else if (activeTab === "Adults") {
          q = query(q, where("age", ">", 1));
        }

        const querySnapshot = await getDocs(q);
        const dogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Dog[];

        const filteredDogs = dogsData.filter(
          (dog) =>
            dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setDogs(filteredDogs);
        
        if (searchTerm) {
          toast.success(`Found ${filteredDogs.length} matching dogs`);
        }
      } catch (error) {
        toast.error("Failed to load dogs");
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, [searchTerm, activeTab]);

  const handlePriceChange = (min: number, max: number) => {
    setPriceFilter({ min, max });
  };

  const toggleFavorite = (dogId: string) => {
    setFavorites(prev =>
      prev.includes(dogId)
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    );
  };

  const handleAddToCart = (dog: Dog) => {
    const isAlreadyInCart = cart.some(item => item.id === dog.id);
    
    if (isAlreadyInCart) {
      return;
    }
    
    // Check if cart is empty before adding
    const wasCartEmpty = cart.length === 0;
    addToCart(dog);
    
    toast.success(`${dog.name} added to cart!`);
    
    // Open cart if it was empty before adding
    if (wasCartEmpty) {
      setIsCartOpen(true);
    }
  };
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = cartTotal * 0.07;
  const discount = cart.length >= 3 ? cartTotal * 0.1 : 0;

  const displayedDogs = (showFavorites
    ? dogs.filter(dog => favorites.includes(dog.id))
    : dogs)
    .filter(dog => {
      const price = dog.price;
      const meetsMin = priceFilter.min !== undefined ? price >= priceFilter.min : true;
      const meetsMax = priceFilter.max !== undefined ? price <= priceFilter.max : true;
      return meetsMin && meetsMax;
    });

  return (
    <>
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={() => {}}>
        <div className="flex justify-center w-full max-w-2xl mx-auto">
          <SearchBar 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={() => {}}
            placeholder="Search by name or breed..."
            large 
            color='white' 
            textColor='blue' 
            stroke='white'
          />
        </div>
      </Hero>

      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        totalResults={totalResults}
        filteredResults={displayedDogs.length}
        cartCount={cart.length}
        favoritesCount={favorites.length}
        showFavorites={showFavorites}
        minPrice={priceFilter.min}
        maxPrice={priceFilter.max}
        onPriceChange={handlePriceChange}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-grow container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center mt-12">
            <Loader size="lg" />
          </div>
        ) : displayedDogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">
              {showFavorites 
                ? "You haven't favorited any dogs yet"
                : "No dogs found matching your criteria"}
            </p>
            {showFavorites && (
              <button
                onClick={() => setShowFavorites(false)}
                className="mt-4 text-blue-600 hover:underline"
              >
                Browse all dogs
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {activeTab !== "All" && (
                  <span className="mr-2">Filter: {activeTab}</span>
                )}
                {searchTerm && (
                  <span className="mr-2">Search: "{searchTerm}"</span>
                )}
                {showFavorites && (
                  <span>Showing favorites only</span>
                )}
                {(priceFilter.min !== undefined || priceFilter.max !== undefined) && (
                  <span className="ml-2">
                    Price: ${priceFilter.min ?? '0'} - ${priceFilter.max !== undefined ? priceFilter.max : '∞'}
                  </span>
                )}
              </div>
              <div className="text-gray-600">
                {displayedDogs.length} {displayedDogs.length === 1 ? 'result' : 'results'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedDogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  isFavorite={favorites.includes(dog.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tax={tax}
        discount={discount}
      />
    </>
  );
};


