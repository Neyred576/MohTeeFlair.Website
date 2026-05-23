import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBg3Frvs-fXYX7eWjaWT81vnXn7XZ4j6TM",
  authDomain: "mohteeflair-app.firebaseapp.com",
  projectId: "mohteeflair-app",
  storageBucket: "mohteeflair-app.firebasestorage.app",
  messagingSenderId: "785158128760",
  appId: "1:785158128760:web:42a64cc4b8d9b1d95ad98d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
