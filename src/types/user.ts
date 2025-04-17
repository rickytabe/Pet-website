import firebase from "firebase/compat/app";


// types/user.ts
export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  cart: string[];          // Array of dog IDs in cart
  purchasedDocs: string[]; // Array of purchased document IDs
  createdAt: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
}

// types/dog.ts
export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  price: number;
  description: string;
  images: string[];
  isAvailable: boolean;
  createdAt: firebase.firestore.Timestamp;
}

// types/order.ts
export interface Order {
  id: string;
  userId: string;
  items: string[]; // Dog IDs
  total: number;
  paymentMethod: 'momo' | 'paypal' | 'card';
  shippingAddress: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: firebase.firestore.Timestamp;
}

// NEW: types/favorites.ts
export interface UserFavorites {
  userId: string;          // Reference to user document
  dogIds: string[];        // Array of favorited dog IDs
  updatedAt: firebase.firestore.Timestamp;
}