// utils/favorites.ts
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../config/firebase";

export const addFavorite = async (userId: string, dogId: string) => {
  const favRef = doc(db, "userFavorites", userId);
  await setDoc(favRef, { dogIds: arrayUnion(dogId) }, { merge: true });
};

export const removeFavorite = async (userId: string, dogId: string) => {
  const favRef = doc(db, "userFavorites", userId);
  await updateDoc(favRef, { dogIds: arrayRemove(dogId) });
};

export const getFavorites = async (userId: string): Promise<string[]> => {
  const favRef = doc(db, "userFavorites", userId);
  const docSnap = await getDoc(favRef);
  return docSnap.exists() ? docSnap.data().dogIds || [] : [];
};