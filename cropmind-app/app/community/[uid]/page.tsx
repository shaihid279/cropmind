"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebase";

interface Crop {
  id: string;
  cropName: string;
  sownDate: string;
}

export default function FarmerPublicProfile() {
  const params = useParams();
  const router = useRouter();
  const uid = params.uid as string;

  const [profile, setProfile] = useState<{ displayName: string; bio: string } | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [myUid, setMyUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setMyUid(u?.uid || null));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    getDoc(doc(db, "farmer_profiles", uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data() as any);
    });

    const q = query(collection(db, "crops"), where("userId", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      // Sirf naam aur date — cost/profit kabhi nahi
      setCrops(
        snap.docs.map((d) => ({
          id: d.id,
          cropName: d.data().cropName,
          sownDate: d.data().sownDate,
        }))
      );
    });
    return () => unsub();
  }, [uid]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {(profile?.displayName || "F")[0].toUpperCase()}
        </div>
        <h1 className="text-xl font-bold text-gray-800 mt-3">{profile?.displayName || "Farmer"}</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">{profile?.bio || "No bio yet"}</p>
      </div>

      {myUid && myUid !== uid && (
        <button
          onClick={() => router.push(`/chat/${[myUid, uid].sort().join("_")}?with=${uid}`)}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-3.5 font-bold shadow-lg mb-6"
        >
          💬 Message
        </button>
      )}

      <h2 className="font-bold text-gray-800 mb-3">🌱 Crops Growing</h2>
      {crops.length === 0 ? (
        <p className="text-gray-400 text-sm">Koi crop share nahi kiya abhi tak.</p>
      ) : (
        <div className="space-y-2">
          {crops.map((c) => (
            <div key={c.id} className="bg-white/80 rounded-2xl p-4 shadow-sm border border-white">
              <p className="font-semibold text-gray-800 text-sm">{c.cropName}</p>
              <p className="text-xs text-gray-400">Sown: {c.sownDate}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}  