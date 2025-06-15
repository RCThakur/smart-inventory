import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBodSzSDgQtlhRt8tJP1qn-kkJ60gI3d0E",
  authDomain: "smartinventory-app.firebaseapp.com",
  projectId: "smartinventory-app",
  storageBucket: "smartinventory-app.firebasestorage.app",
  messagingSenderId: "730465553533",
  appId: "1:730465553533:web:d63d55641efe98adbb7514",
  measurementId: "G-W64M3NCB9K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
