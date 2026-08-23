"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function InputPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const crop = searchParams.get("crop") || "";
  const district = searchParams.get("district") || "";
  const lang = searchParams.get("lang") || "english";

  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (!question.trim()) {
      alert("Pehle apna sawaal likho!");
      return;
    }
    router.push(
      `/result?crop=${crop}&district=${district}&lang=${lang}&question=${encodeURIComponent(
        question
      )}`
    );
  };

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-2">
        🌾 Ask Your Question
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Crop: {crop || "Not selected"} | District: {district || "Not entered"}
      </p>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Your Question
          </label>
          <textarea
            className="w-full border rounded-lg p-2 h-24"
            placeholder="e.g. Mera crop ka patta yellow ho raha hai, kya karu?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Photo (optional)
          </label>
          <input type="file" accept="image/*" className="w-full text-sm" />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white rounded-lg p-3 font-semibold hover:bg-green-700"
        >
          Submit
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full text-green-700 text-sm underline"
        >
          ← Back to Home
        </button>
      </div>
    </main>
  );
}