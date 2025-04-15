import { createContext, useContext, useState } from 'react';
import { Dog } from '../types/user';

interface CartContextType {
  cart: Dog[];
  addToCart: (dog: Dog) => void;
  removeFromCart: (dogId: string) => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {}
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Dog[]>([]);

  const addToCart = (dog: Dog) => {
    setCart(prev => [...prev, dog]);
  };

  const removeFromCart = (dogId: string) => {
    setCart(prev => prev.filter(dog => dog.id !== dogId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);