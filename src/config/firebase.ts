// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {  getFirestore } from "firebase/firestore";
// import { dogData } from "./dogData";

// config/firebase.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Firebase Config:", firebaseConfig); // Log the config to check if it's correct
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// const ADMIN_UID = "JoUFzMhWmTaDmQ6irgA3RHP1cml2"; 

// const seedDogs = async () => {
//   try {
//     for (const dog of dogData) {
//       await addDoc(collection(db, "dogs"), {
//         ...dog,
//         createdAt: serverTimestamp(),
//         createdBy: ADMIN_UID
//       });
//       console.log(`Added ${dog.name}`);
//     }
//     console.log("✅ Successfully seeded 25 dogs");
//   } catch (error) {
//     console.error("Error seeding dogs:", error);
//   } finally {
//     process.exit(0);
//   }
// };

// seedDogs();