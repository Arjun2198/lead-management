// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClh79ez4q8b2tGI1zOvJhAEw3UDdZy9bc",
  authDomain: "lead-stack-app.firebaseapp.com",
  projectId: "lead-stack-app",
  storageBucket: "lead-stack-app.firebasestorage.app",
  messagingSenderId: "620228209813",
  appId: "1:620228209813:web:368f02df950bbba708ff9c"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false
});
export const auth = getAuth(app);
export const db = getFirestore(app);