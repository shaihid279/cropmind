"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

interface Report {
  id: string;
  cropName: string;
  disease: string;
  district: string;
  severity: string;
}

export default function OutbreakPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "outbreak_reports"),
      orderBy("timestamp", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Report[]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const grouped: Record<string, number> = {};
  reports.forEach((r) => {
    const key = `${r.district} — ${r.disease}`;
    grouped[key] = (grouped[key] || 0) + 1;
  });
  const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">📡 Outbreak Radar</h1>
      <p className="text-sm text-gray-500 mb-6">
        Community-reported diseases — real-time, aapke area ke farmers ke scans se
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl">🌾</span>
          <p className="text-gray-500 mt-4">Abhi koi outbreak report nahi hai.</p>
          <p className="text-gray-400 text-sm mt-1">
            Jaise-jaise farmers scan karenge, yahan pattern dikhega.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(([key, count], i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md shadow-green-100 border border-white p-4 flex items-center justify-between"
            >
              <p className="text-sm font-medium text-gray-800">{key}</p>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  count >= 5
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {count} reports
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 