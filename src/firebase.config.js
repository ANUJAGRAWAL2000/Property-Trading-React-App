// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZo_LZSFXQiR7QFd06WDMBYtT7YEYBeMo",
  authDomain: "house-market-24bb9.firebaseapp.com",
  projectId: "house-market-24bb9",
  storageBucket: "house-market-24bb9.appspot.com",
  messagingSenderId: "1007723081716",
  appId: "1:1007723081716:web:15681e949e044066b7d3a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();