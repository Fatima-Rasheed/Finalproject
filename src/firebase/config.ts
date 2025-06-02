// src/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'; // ✅ added
import { db } from '@/app/lib/firebase';

const firebaseConfig = {
  apiKey: "AIzaSyA8tZwCG9TM11n3tfFM-iWeOII0nSRdCQs",
  authDomain: "digital-fyp.firebaseapp.com",
  projectId: "digital-fyp",
  storageBucket: "digital-fyp.firebasestorage.app",
  messagingSenderId: "727365128968",
  appId: "1:727365128968:web:86d79cb4f31c6c4a1c92bd",
  measurementId: "G-VPFT0S4NNX"
};

// ✅ Prevent duplicate initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ✅ Enable session persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence); // 🛡 Keeps user logged in

export { db, auth };
