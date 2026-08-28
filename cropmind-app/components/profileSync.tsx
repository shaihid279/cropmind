"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function ProfileSync() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const ref = doc(db, "farmer_profiles", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            displayName: u.displayName || u.email?.split("@")[0] || "Farmer",
            bio: "",
            photoURL: "",
            createdAt: Timestamp.now(),
          });
        }
      }
    });
    return () => unsub();
  }, []);

  return null;
} 