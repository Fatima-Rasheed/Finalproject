// src/lib/firebase.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA8tZwCG9TM11n3tfFM-iWeOII0nSRdCQs",
  authDomain: "digital-fyp.firebaseapp.com",
  projectId: "digital-fyp",
  storageBucket: "digital-fyp.appspot.com", // ✅ Fix this if it was incorrect
  messagingSenderId: "727365128968",
  appId: "1:727365128968:web:86d79cb4f31c6c4a1c92bd",
  measurementId: "G-VPFT0S4NNX"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Firebase services exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Important for upload/download
