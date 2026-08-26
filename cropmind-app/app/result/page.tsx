"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAdviceByIndex } from "../../lib/adviceLookup"; 

function severityStyle(severity: string) {
  const s = severity.toLowerCase();
  if (s.includes("high") || s.includes("अधिक") || s.includes("जास्त"))
    return "bg-red-100 text-red-700 border-red-200";
  if (s.includes("medium") || s.includes("मध्यम"))
    return "bg-amber-100 text-amber-700 border-amber-200";
  if (s.includes("none") || s.includes("healthy") || s.includes("नाही") || s.includes("कोई नहीं"))
    return "bg-green-100 text-green-700 border-green-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

function InfoRow({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        <p className="text-gray-600 text-sm mt-0.5 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

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
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mb-4 text-center">
        <span className="text-4xl">
          {hasImageResult && advice?.severity?.toLowerCase().includes("none")
            ? "✅"
            : hasImageResult
            ? "🩺"
            : "💬"}
        </span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-2">
          Your Advice Is Ready
        </h1>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-7 w-full max-w-md space-y-5">
        {/* Meta info */}
        <div className="flex flex-wrap gap-2 text-xs">
          {district && (
            <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              📍 {district}
            </span>
          )}
          {question && (
            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium max-w-full truncate">
              💬 {question}
            </span>
          )}
        </div>

        {hasImageResult && advice ? (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">CROP</p>
                <p className="font-bold text-gray-800 text-lg">{advice.crop}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium">DISEASE</p>
                <p className="font-bold text-gray-800">{advice.disease}</p>
              </div>
            </div>

            <span
              className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full border ${severityStyle(
                advice.severity
              )}`}
            >
              Severity: {advice.severity}
            </span>

            <div className="space-y-4 pt-2">
              <InfoRow icon="🔎" title="Symptoms" text={advice.symptoms} />
              <InfoRow icon="💊" title="Treatment" text={advice.treatment} />
              <InfoRow icon="🛡️" title="Prevention" text={advice.prevention} />
            </div>

            <details className="group pt-2 border-t border-gray-100">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-green-700 py-2 list-none">
                More Details
                <span className="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="space-y-4 pt-2">
                <InfoRow icon="🌱" title="Sowing" text={advice.sowing} />
                <InfoRow icon="💧" title="Irrigation" text={advice.irrigation} />
                <InfoRow icon="🧪" title="Fertilizer" text={advice.fertilizer} />
              </div>
            </details>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              No photo was analyzed. Upload a photo next time to get a full disease diagnosis.
            </p>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 font-bold shadow-lg shadow-green-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
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