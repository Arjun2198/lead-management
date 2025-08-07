// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtkFnKUP2Ys30e_3MkAH82njOTr7Mq4Xk",
  authDomain: "lead-stack.firebaseapp.com",
  projectId: "lead-stack",
  storageBucket: "lead-stack.firebasestorage.app",
  messagingSenderId: "1048877591689",
  appId: "1:1048877591689:web:b06ab831f370ce9608aa58",
  measurementId: "G-WQELT437QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);