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
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-8">
        🌾 KisanScan
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Crop</label>
          <select
            className="w-full border rounded-lg p-2"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="">-- Select Crop --</option>
            {cropNames.map((key) => (
              <option key={key} value={key}>
                {crops[key].name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2"
            placeholder="e.g. Ahmednagar"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            className="w-full border rounded-lg p-2"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="marathi">Marathi</option>
          </select>
        </div>

        <button
          onClick={handleGetAdvice}
          className="w-full bg-green-600 text-white rounded-lg p-3 font-semibold hover:bg-green-700"
        >
          Get Advice
        </button>
      </div>
    </main>
  );
}