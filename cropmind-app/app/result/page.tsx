"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import crops from "../../data/crops";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cropKey = searchParams.get("crop") || "";
  const district = searchParams.get("district") || "";
  const question = searchParams.get("question") || "";

  const cropData: any = (crops as any)[cropKey];

  const dummyAdvice = cropData
    ? `${cropData.name} ke liye salah: Irrigation - ${cropData.irrigation}. Fertilizer - ${cropData.fertilizer}. Agar disease dikhe toh: ${cropData.commonDiseases[0]?.solution || "Local expert se sampark karein"}.`
    : "Crop data nahi mila, kripya sahi crop select karein.";

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        🌾 Advice for You
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md space-y-4">
        <div className="text-sm text-gray-600">
          <p><strong>Crop:</strong> {cropData?.name || "N/A"}</p>
          <p><strong>District:</strong> {district || "N/A"}</p>
          <p><strong>Your Question:</strong> {question || "N/A"}</p>
        </div>

        <div className="border-t pt-4">
          <h2 className="font-semibold text-green-700 mb-2">Advice:</h2>
          <p className="text-gray-800">{dummyAdvice}</p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-green-600 text-white rounded-lg p-3 font-semibold hover:bg-green-700 mt-4"
        >
          Ask Another Question
        </button>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}