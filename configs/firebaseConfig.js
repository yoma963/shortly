// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "shortly-6c877.firebaseapp.com",
  projectId: "shortly-6c877",
  storageBucket: "shortly-6c877.firebasestorage.app",
  messagingSenderId: "744950331476",
  appId: "1:744950331476:web:5bb0799c2a4dce995155c1",
  measurementId: "G-8TY2VHFRCY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);