// context/CartContent.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { Dog } from '../types/user';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Dog[];
  addToCart: (dog: Dog) => Promise<void>;
  removeFromCart: (dogId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  loading: false,
  error: null,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from Firebase when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const cartIds = userDoc.data()?.cart || [];
        
        // Fetch dog details for all cart items
        const dogPromises = cartIds.map((id: string) => getDoc(doc(db, 'dogs', id)));
        const dogDocs = await Promise.all(dogPromises);
        
        const validDogs = dogDocs
          .filter(doc => doc.exists())
          .map(doc => ({ id: doc.id, ...doc.data() } as Dog));

        setCart(validDogs);
        setError(null);
      } catch (err) {
        setError('Failed to load cart');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (dog: Dog) => {
    if (!user) {
      setError('You must be logged in to add to cart');
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      
      // Update Firebase
      await updateDoc(userRef, {
        cart: arrayUnion(dog.id)
      });

      // Update local state
      setCart(prev => [...prev, dog]);
      setError(null);
    } catch (err) {
      setError('Failed to add to cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (dogId: string) => {
    if (!user) {
      setError('You must be logged in to remove from cart');
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      
      // Update Firebase
      await updateDoc(userRef, {
        cart: arrayRemove(dogId)
      });

      // Update local state
      setCart(prev => prev.filter(dog => dog.id !== dogId));
      setError(null);
    } catch (err) {
      setError('Failed to remove from cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      setError('You must be logged in to clear cart');
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      
      // Update Firebase
      await updateDoc(userRef, {
        cart: []
      });

      // Update local state
      setCart([]);
      setError(null);
    } catch (err) {
      setError('Failed to clear cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, loading, error }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);