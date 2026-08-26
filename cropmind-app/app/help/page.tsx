"use client";

import { useRouter } from "next/navigation";

const faqs = [
  {
    q: "Photo se disease kaise pata chalta hai?",
    a: "Apni crop ki photo Scan tab se upload karo. Hamara AI model turant disease pehchan kar treatment advice deta hai — sab kuch phone ke andar hi hota hai, internet ki zarurat nahi.",
  },
  {
    q: "My Crops mein kya track hota hai?",
    a: "Sowing date, fertilizer/pesticide activities, unki cost, aur sale revenue — sab track karke automatic profit calculate ho jata hai.",
  },
  {
    q: "Kya ye app free hai?",
    a: "Haan, KisanScan poori tarah free hai, koi hidden charge nahi.",
  },
  {
    q: "Login zaroori hai kya?",
    a: "Disease scan aur advice ke liye login zaroori nahi. My Crops tracker use karne ke liye login karna padega, taaki tumhara data safe rahe.",
  },
];

export default function HelpPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">❓ Help & Support</h1>

      <div className="space-y-3">
        {faqs.map((item, i) => (
          <details
            key={i}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md shadow-green-100 border border-white p-4"
          >
            <summary className="font-semibold text-gray-800 cursor-pointer text-sm">
              {item.q}
            </summary>
            <p className="text-gray-600 text-sm mt-2">{item.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
} 