import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase";

// Save a new favorite city
export async function addFavoriteCity(userId, city) {
  const userDoc = doc(db, "users", userId);
  await setDoc(userDoc, { favorites: arrayUnion(city) }, { merge: true });
}

// Get all favorite cities
export async function getFavoriteCities(userId) {
  const userDoc = doc(db, "users", userId);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    return docSnap.data().favorites || [];
  }
  return [];
}

// Remove a favorite city
export async function removeFavoriteCity(userId, city) {
  const userDoc = doc(db, "users", userId);
  await updateDoc(userDoc, {
    favorites: arrayRemove(city),
  });
}
