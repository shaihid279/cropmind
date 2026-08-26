"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import adviceDb from "../../data/advice_db.json";
import { Lang } from "../../lib/i18n";
import { useLanguage } from "../../components/LanguageContext";

const uniqueCrops = Array.from(
  new Set(Object.values(adviceDb).map((e: any) => e.crop.english))
);

export default function OnboardingPage() {
  const router = useRouter();
  const { setLang } = useLanguage();
  const [step, setStep] = useState(0);

  const [state, setState] = useState("");
  const [selectedLang, setSelectedLang] = useState<Lang>("english");
  const [primaryCrop, setPrimaryCrop] = useState("");

  const finish = () => {
    localStorage.setItem("kisanscan_onboarded", "true");
    localStorage.setItem(
      "kisanscan_profile",
      JSON.stringify({ state, primaryCrop })
    );
    setLang(selectedLang);
    router.push("/");
  };

  const skip = () => {
    localStorage.setItem("kisanscan_onboarded", "true");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex gap-1.5 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-green-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div>
            <span className="text-4xl">👋</span>
            <h1 className="text-2xl font-extrabold text-gray-800 mt-4">
              Welcome to KisanScan!
            </h1>
            <p className="text-gray-500 text-sm mt-2 mb-8">
              Aapko konse state se ho? Isse hum better advice de sakenge.
            </p>
            <input
              type="text"
              className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-white focus:border-green-400 focus:outline-none mb-6"
              placeholder="e.g. Maharashtra"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <button
              onClick={() => setStep(1)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 font-bold shadow-lg mb-3"
            >
              Continue →
            </button>
            <button onClick={skip} className="w-full text-gray-400 text-sm font-medium">
              Skip for now
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <span className="text-4xl">🌐</span>
            <h1 className="text-2xl font-extrabold text-gray-800 mt-4">
              Choose Your Language
            </h1>
            <p className="text-gray-500 text-sm mt-2 mb-8">
              Poora app isi bhasha mein chalega.
            </p>
            <div className="space-y-3 mb-6">
              {[
                { value: "english", label: "English" },
                { value: "hindi", label: "हिंदी (Hindi)" },
                { value: "marathi", label: "मराठी (Marathi)" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedLang(opt.value as Lang)}
                  className={`w-full p-4 rounded-2xl text-left font-semibold transition-all ${
                    selectedLang === opt.value
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border-2 border-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 font-bold shadow-lg mb-3"
            >
              Continue →
            </button>
            <button onClick={skip} className="w-full text-gray-400 text-sm font-medium">
              Skip for now
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <span className="text-4xl">🌾</span>
            <h1 className="text-2xl font-extrabold text-gray-800 mt-4">
              Aap Zyada Konsi Crop Lete Ho?
            </h1>
            <p className="text-gray-500 text-sm mt-2 mb-8">
              Isse hum tumhe relevant tips denge.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {uniqueCrops.map((c) => (
                <button
                  key={c}
                  onClick={() => setPrimaryCrop(c)}
                  className={`p-3.5 rounded-2xl text-sm font-semibold transition-all ${
                    primaryCrop === c
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border-2 border-gray-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              onClick={finish}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 font-bold shadow-lg mb-3"
            >
              Let's Start 🚀
            </button>
            <button onClick={skip} className="w-full text-gray-400 text-sm font-medium">
              Skip for now
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 