import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Ensure all required environment variables are present
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  throw new Error("Missing Firebase API Key");
}
if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
  throw new Error("Missing Firebase Project ID");
}
if (!import.meta.env.VITE_FIREBASE_APP_ID) {
  throw new Error("Missing Firebase App ID");
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;