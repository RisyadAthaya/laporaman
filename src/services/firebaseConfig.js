// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsNYM00x2nZiKfldZNERZQo99TbxSoEZE",
  authDomain: "laporaman-46df6.firebaseapp.com",
  projectId: "laporaman-46df6",
  storageBucket: "laporaman-46df6.firebasestorage.app",
  messagingSenderId: "186493992449",
  appId: "1:186493992449:web:5d1b0b0768bcbdb6374a00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getFirestore(app);