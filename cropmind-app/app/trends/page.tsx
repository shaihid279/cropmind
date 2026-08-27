"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

interface CropCount {
  name: string;
  count: number;
  zone: "green" | "yellow" | "red";
}

export default function TrendsPage() {
  const router = useRouter();
  const [trends, setTrends] = useState<CropCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "crops"), (snap) => {
      const counts: Record<string, number> = {};
      snap.docs.forEach((d) => {
        const name = (d.data() as any).cropName;
        if (name) counts[name] = (counts[name] || 0) + 1;
      });

      const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
      const arr: CropCount[] = Object.entries(counts).map(([name, count]) => {
        const share = count / total;
        const zone: "green" | "yellow" | "red" =
          share < 0.15 ? "green" : share < 0.3 ? "yellow" : "red";
        return { name, count, zone };
      });

      arr.sort((a, b) => b.count - a.count);
      setTrends(arr);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const zoneStyle = {
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", label: "🟢 Kam Log — Achha Rate Milega" },
    yellow: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "🟡 Medium — Theek Hai" },
    red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "🔴 Zyada Log — Rate Girega" },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">📊 Crop Trends</h1>
      <p className="text-sm text-gray-500 mb-6">
        Sabse zyada log kya laga rahe hain — smart decision lo
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : trends.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-16">Abhi data nahi hai.</p>
      ) : (
        <div className="space-y-3">
          {trends.map((t) => {
            const style = zoneStyle[t.zone];
            return (
              <div
                key={t.name}
                className={`${style.bg} border-2 ${style.border} rounded-2xl p-4`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-gray-800">{t.name}</p>
                  <span className="text-sm font-bold text-gray-700">{t.count} farmers</span>
                </div>
                <p className={`text-xs font-semibold ${style.text}`}>{style.label}</p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
} 