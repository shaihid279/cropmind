"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../components/LanguageContext";

interface RiskData {
  district: string;
  temp: number;
  humidity: number;
  condition: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
}

export default function RiskPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);
  const [district, setDistrict] = useState("");
  const [data, setData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const profile = localStorage.getItem("kisanscan_profile");
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.state) setDistrict(parsed.state);
    }
  }, []);

  const fetchRisk = async () => {
    if (!district.trim()) {
      setError("District/area naam daalo");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/risk-score?district=${encodeURIComponent(district)}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch (err) {
      setError("Kuch problem aayi, dobara try karo");
    }
    setLoading(false);
  };

  const riskColor =
    data?.riskLevel === "high"
      ? "from-red-500 to-orange-500"
      : data?.riskLevel === "medium"
      ? "from-amber-400 to-yellow-500"
      : "from-green-500 to-emerald-500";

  const riskText =
    data?.riskLevel === "high" ? t("riskHigh") : data?.riskLevel === "medium" ? t("riskMedium") : t("riskLow");

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">🌤️ {t("riskTitle")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("riskSubtitle")}</p>

      {!isOnline ? (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 text-center">
          <span className="text-4xl">📡</span>
          <h2 className="font-bold text-gray-800 mt-3">{t("needsInternet")}</h2>
          <p className="text-sm text-gray-500 mt-2">{t("needsInternetDesc")}</p>
        </div>
      ) : (
        <>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-6 mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">District</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border-2 border-gray-100 rounded-2xl p-3 bg-gray-50 focus:border-green-400 focus:outline-none"
                placeholder="e.g. Ahmednagar"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
              <button
                onClick={fetchRisk}
                disabled={loading}
                className="bg-green-600 text-white rounded-2xl px-5 font-semibold disabled:opacity-60"
              >
                {loading ? "..." : "Check"}
              </button>
            </div>
            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
          </div>

          {data && (
            <div className={`bg-gradient-to-br ${riskColor} rounded-3xl p-6 text-white shadow-xl`}>
              <p className="text-sm opacity-90">{data.district}</p>
              <h2 className="text-3xl font-extrabold mt-1">{data.riskScore}%</h2>
              <p className="font-semibold mt-1">{riskText}</p>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-white/20 rounded-2xl p-3 text-center">
                  <p className="text-xs opacity-80">{t("temperature")}</p>
                  <p className="font-bold">{data.temp}°C</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-3 text-center">
                  <p className="text-xs opacity-80">{t("humidity")}</p>
                  <p className="font-bold">{data.humidity}%</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-3 text-center">
                  <p className="text-xs opacity-80">{t("condition")}</p>
                  <p className="font-bold text-sm">{data.condition}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
} 