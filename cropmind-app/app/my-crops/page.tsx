"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

interface CropEntry {
  id: string;
  cropName: string;
  sownDate: string;
  activities: { date: string; type: string; note: string; cost: number }[];
  totalCost: number;
}

export default function MyCropsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [crops, setCrops] = useState<CropEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCropName, setNewCropName] = useState("");
  const [newSownDate, setNewSownDate] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "crops"),
      where("userId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const list: CropEntry[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CropEntry[];
      setCrops(list);
    });
    return () => unsub();
  }, [user]);

  const handleAddCrop = async () => {
    if (!newCropName.trim() || !newSownDate) {
      alert("Crop naam aur date dono zaroori hain");
      return;
    }
    await addDoc(collection(db, "crops"), {
      userId: user!.uid,
      cropName: newCropName,
      sownDate: newSownDate,
      activities: [],
      totalCost: 0,
      createdAt: Timestamp.now(),
    });
    setNewCropName("");
    setNewSownDate("");
    setShowAddForm(false);
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
      </main>
    );
  }

  // NOT LOGGED IN — Gate this feature
  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-200 mb-4">
          <span className="text-4xl">🔒</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Login Required
        </h1>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          Apne crops track karne ke liye pehle login karo — ye tera data safe
          rakhta hai aur har jagah se access hota hai.
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl px-8 py-3.5 font-bold shadow-lg shadow-green-200 hover:shadow-xl transition-all"
        >
          Login / Sign Up →
        </button>
      </main>
    );
  }

  // LOGGED IN — Show tracker
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            🌱 My Crops
          </h1>
          <p className="text-sm text-gray-500">Track from sowing to sale</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white rounded-full w-11 h-11 flex items-center justify-center text-2xl shadow-lg shadow-green-200 hover:bg-green-700 transition-colors"
        >
          {showAddForm ? "×" : "+"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-6 mb-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Crop Name
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-100 rounded-2xl p-3 text-gray-700 bg-gray-50 focus:border-green-400 focus:outline-none"
              placeholder="e.g. Soybean"
              value={newCropName}
              onChange={(e) => setNewCropName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Sowing Date
            </label>
            <input
              type="date"
              className="w-full border-2 border-gray-100 rounded-2xl p-3 text-gray-700 bg-gray-50 focus:border-green-400 focus:outline-none"
              value={newSownDate}
              onChange={(e) => setNewSownDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddCrop}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-3.5 font-bold shadow-md hover:shadow-lg transition-all"
          >
            Start Tracking
          </button>
        </div>
      )}

      {crops.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl">🌾</span>
          <p className="text-gray-500 mt-4">
            Koi crop track nahi kiya abhi tak.
          </p>
          <p className="text-gray-400 text-sm">
            Upar + button dabao naya crop add karne ke liye.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {crops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => router.push(`/my-crops/${crop.id}`)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md shadow-green-100 border border-white p-5 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">
                    {crop.cropName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Sown: {crop.sownDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Cost</p>
                  <p className="font-bold text-green-700">
                    ₹{crop.totalCost || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 