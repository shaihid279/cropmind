"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import cropsData from "../data/crops";

const crops: Record<string, any> = cropsData;

export default function Home() {
  const router = useRouter();
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const cropNames = Object.keys(crops);

  const handleGetAdvice = () => {
    if (!selectedCrop) {
      alert("Pehle crop select karo!");
      return;
    }
    router.push(
      `/input?crop=${selectedCrop}&district=${selectedDistrict}&lang=${selectedLanguage}`
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col items-center justify-center p-6">
      {/* Logo & Title */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-200 mb-4 transform hover:rotate-6 transition-transform duration-300">
          <span className="text-4xl">🌾</span>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent tracking-tight">
          KisanScan
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          AI-powered crop advisory for every farmer
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-7 w-full max-w-sm space-y-5">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
            🌱 Select Crop
          </label>
          <select
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 text-gray-700 bg-gray-50 focus:border-green-400 focus:bg-white focus:outline-none transition-all"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="">-- Choose your crop --</option>
            {cropNames.map((key) => (
              <option key={key} value={key}>
                {crops[key].name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
            📍 District
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 text-gray-700 bg-gray-50 focus:border-green-400 focus:bg-white focus:outline-none transition-all"
            placeholder="e.g. Ahmednagar"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
            🌐 Language
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "english", label: "English" },
              { value: "hindi", label: "हिंदी" },
              { value: "marathi", label: "मराठी" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedLanguage(opt.value)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedLanguage === opt.value
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGetAdvice}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 font-bold text-base shadow-lg shadow-green-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Get Advice →
        </button>
<button
  onClick={() => router.push("/outbreak")}
  className="w-full mt-3 bg-amber-50 text-amber-700 rounded-2xl p-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors"
>
  📡 Check Outbreak Radar
</button>

      </div>

      <p className="text-xs text-gray-400 mt-6">
        Built for Maharashtra farmers 🇮🇳
      </p>
    </main>
  );
}