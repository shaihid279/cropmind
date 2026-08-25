"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAdviceByIndex } from "../lib/adviceLookup";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const district = searchParams.get("district") || "";
  const question = searchParams.get("question") || "";
  const lang = searchParams.get("lang") || "english";
  const predictedIndex = parseInt(searchParams.get("predictedIndex") || "-1");

  const hasImageResult = predictedIndex >= 0;
  const advice = hasImageResult ? getAdviceByIndex(predictedIndex, lang) : null;

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        🌾 Advice for You
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md space-y-4">
        <div className="text-sm text-gray-600">
          <p><strong>District:</strong> {district || "N/A"}</p>
          {question && <p><strong>Your Question:</strong> {question}</p>}
        </div>

        {hasImageResult && advice ? (
          <div className="border-t pt-4 space-y-3">
            <div>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {advice.crop}
              </span>
              <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded ml-2">
                {advice.disease} ({advice.severity})
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 text-sm">Symptoms:</h3>
              <p className="text-gray-800 text-sm">{advice.symptoms}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 text-sm">Treatment:</h3>
              <p className="text-gray-800 text-sm">{advice.treatment}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 text-sm">Prevention:</h3>
              <p className="text-gray-800 text-sm">{advice.prevention}</p>
            </div>
            <details className="text-sm">
              <summary className="font-semibold text-green-700 cursor-pointer">
                More Info (Sowing, Irrigation, Fertilizer)
              </summary>
              <p className="mt-2"><strong>Sowing:</strong> {advice.sowing}</p>
              <p className="mt-1"><strong>Irrigation:</strong> {advice.irrigation}</p>
              <p className="mt-1"><strong>Fertilizer:</strong> {advice.fertilizer}</p>
            </details>
          </div>
        ) : (
          <div className="border-t pt-4">
            <p className="text-gray-800 text-sm">
              Koi photo upload nahi hui. Photo upload karke crop ki disease detect karwa sakte ho.
            </p>
          </div>
        )}

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