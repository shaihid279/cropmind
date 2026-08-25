import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUdm2h4KMJiktUAh5rw7hOm_E3pzKq8U0",
  authDomain: "cropmind-3a800.firebaseapp.com",
  projectId: "cropmind-3a800",
  storageBucket: "cropmind-3a800.firebasestorage.app",
  messagingSenderId: "169075796589",
  appId: "1:169075796589:web:6b366b9fa8c59269362d64"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 