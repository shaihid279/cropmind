"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../../../firebase";
import { useToast } from "../../../components/Toast";

interface Activity {
  id: string;
  date: string;
  type: string;
  note: string;
  cost: number;
}

interface CropData {
  cropName: string;
  sownDate: string;
  activities: Activity[];
  totalCost: number;
  revenue: number;
}

const activityTypes = [
  { value: "fertilizer", label: "🧪 Fertilizer" },
  { value: "pesticide", label: "🐛 Pesticide/Medicine" },
  { value: "irrigation", label: "💧 Irrigation" },
  { value: "labor", label: "👷 Labor" },
  { value: "other", label: "📝 Other" },
];

export default function CropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const showToast = useToast();
  const cropId = params.id as string;

  const [crop, setCrop] = useState<CropData | null>(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddRevenue, setShowAddRevenue] = useState(false);

  const [actDate, setActDate] = useState("");
  const [actType, setActType] = useState("fertilizer");
  const [actNote, setActNote] = useState("");
  const [actCost, setActCost] = useState("");
  const [revenueAmount, setRevenueAmount] = useState("");

  useEffect(() => {
    if (!cropId) return;
    const unsub = onSnapshot(doc(db, "crops", cropId), (snap) => {
      if (snap.exists()) setCrop(snap.data() as CropData);
    });
    return () => unsub();
  }, [cropId]);

  const handleAddActivity = async () => {
    if (!actDate || !actNote.trim()) {
      showToast("Date aur note dono zaroori hain", "error");
      return;
    }
    const cost = parseFloat(actCost) || 0;
    await updateDoc(doc(db, "crops", cropId), {
      activities: arrayUnion({ id: Date.now().toString(), date: actDate, type: actType, note: actNote, cost }),
      totalCost: increment(cost),
    });
    setActDate("");
    setActNote("");
    setActCost("");
    setShowAddActivity(false);
    showToast("Activity add ho gayi! ✅");
  };

  const handleAddRevenue = async () => {
    const amount = parseFloat(revenueAmount) || 0;
    if (amount <= 0) {
      showToast("Sahi amount dalo", "error");
      return;
    }
    await updateDoc(doc(db, "crops", cropId), { revenue: increment(amount) });
    setRevenueAmount("");
    setShowAddRevenue(false);
    showToast("Revenue add ho gaya! 💰");
  };

  if (!crop) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
      </main>
    );
  }

  const profit = (crop.revenue || 0) - (crop.totalCost || 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6 pb-10">
      <button onClick={() => router.push("/my-crops")} className="text-green-700 text-sm font-medium mb-4">
        ← Back to My Crops
      </button>

      <h1 className="text-2xl font-extrabold text-gray-800">{crop.cropName}</h1>
      <p className="text-sm text-gray-500 mb-6">Sown: {crop.sownDate}</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/80 rounded-2xl p-4 text-center shadow-md shadow-green-100 border border-white">
          <p className="text-xs text-gray-400">Cost</p>
          <p className="font-bold text-red-500">₹{crop.totalCost || 0}</p>
        </div>
        <div className="bg-white/80 rounded-2xl p-4 text-center shadow-md shadow-green-100 border border-white">
          <p className="text-xs text-gray-400">Revenue</p>
          <p className="font-bold text-blue-500">₹{crop.revenue || 0}</p>
        </div>
        <div className="bg-white/80 rounded-2xl p-4 text-center shadow-md shadow-green-100 border border-white">
          <p className="text-xs text-gray-400">Profit</p>
          <p className={`font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>₹{profit}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setShowAddActivity(!showAddActivity)} className="flex-1 bg-green-600 text-white rounded-2xl p-3 font-semibold shadow-md">
          + Add Activity
        </button>
        <button onClick={() => setShowAddRevenue(!showAddRevenue)} className="flex-1 bg-blue-600 text-white rounded-2xl p-3 font-semibold shadow-md">
          + Add Sale
        </button>
      </div>

      {showAddActivity && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-6 mb-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Date</label>
            <input type="date" className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50 focus:border-green-400 focus:outline-none" value={actDate} onChange={(e) => setActDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Type</label>
            <select className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50 focus:border-green-400 focus:outline-none" value={actType} onChange={(e) => setActType(e.target.value)}>
              {activityTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Note</label>
            <input type="text" className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50 focus:border-green-400 focus:outline-none" placeholder="e.g. Urea 50kg spray" value={actNote} onChange={(e) => setActNote(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Cost (₹)</label>
            <input type="number" className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50 focus:border-green-400 focus:outline-none" value={actCost} onChange={(e) => setActCost(e.target.value)} />
          </div>
          <button onClick={handleAddActivity} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-3.5 font-bold shadow-md">
            Save Activity
          </button>
        </div>
      )}

      {showAddRevenue && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-6 mb-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Sale Amount (₹)</label>
            <input type="number" className="w-full border-2 border-gray-100 rounded-2xl p-3 bg-gray-50 focus:border-green-400 focus:outline-none" value={revenueAmount} onChange={(e) => setRevenueAmount(e.target.value)} />
          </div>
          <button onClick={handleAddRevenue} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-3.5 font-bold shadow-md">
            Save Sale
          </button>
        </div>
      )}

      <h2 className="font-bold text-gray-800 mb-3">Activity Timeline</h2>
      {crop.activities?.length ? (
        <div className="space-y-3">
          {[...crop.activities].reverse().map((act) => (
            <div key={act.id} className="bg-white/80 rounded-2xl p-4 shadow-md shadow-green-100 border border-white flex items-center gap-3">
              <span className="text-xl">{activityTypes.find((t) => t.value === act.type)?.label.split(" ")[0] || "📝"}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{act.note}</p>
                <p className="text-xs text-gray-400">{act.date}</p>
              </div>
              <p className="text-sm font-bold text-red-500">₹{act.cost}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm text-center py-8">Koi activity add nahi hui abhi tak.</p>
      )}
    </main>
  );
}  