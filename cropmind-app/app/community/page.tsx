"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

interface FarmerProfile {
  uid: string;
  displayName: string;
  bio: string;
  photoURL?: string;
}

export default function CommunityPage() {
  const router = useRouter();
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "farmer_profiles"));
    const unsub = onSnapshot(q, (snap) => {
      setFarmers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })) as FarmerProfile[]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = farmers.filter((f) =>
    (f.displayName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">👥 Farmer Community</h1>
      <p className="text-sm text-gray-500 mb-4">Dusre farmers se sikho, connect karo</p>

      <input
        type="text"
        className="w-full border-2 border-gray-100 rounded-2xl p-3.5 bg-white mb-6 focus:border-green-400 focus:outline-none"
        placeholder="🔍 Naam se dhundo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-16">Koi farmer nahi mila.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => (
            <div
              key={f.uid}
              onClick={() => router.push(`/community/${f.uid}`)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md shadow-green-100 border border-white p-4 flex items-center gap-3 cursor-pointer"
            >
              {f.photoURL ? (
                <img src={f.photoURL} alt={f.displayName} className="w-11 h-11 rounded-full object-cover" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                  {(f.displayName || "F")[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{f.displayName || "Farmer"}</p>
                <p className="text-xs text-gray-500 truncate">{f.bio || "No bio yet"}</p>
              </div>
              <span className="text-gray-300">›</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 