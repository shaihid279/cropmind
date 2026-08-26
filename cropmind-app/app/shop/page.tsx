"use client";

import { useRouter } from "next/navigation";

const categories = [
  { icon: "🧪", label: "Fertilizers", query: "crop fertilizer" },
  { icon: "🐛", label: "Pesticides", query: "agricultural pesticide" },
  { icon: "🌱", label: "Seeds", query: "crop seeds" },
  { icon: "🔧", label: "Farm Tools", query: "farming tools" },
];

export default function ShopPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">🛒 Shop Supplies</h1>
      <p className="text-sm text-gray-500 mb-6">Best price compare karo, seedha kharido</p>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md shadow-green-100 border border-white p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="font-bold text-gray-800">{cat.label}</h3>
            </div>
            <div className="flex gap-3">
              <a
                href={`https://www.amazon.in/s?k=${encodeURIComponent(cat.query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-orange-50 text-orange-700 rounded-xl py-2.5 text-sm font-semibold"
              >
                Amazon
              </a>
              <a
                href={`https://www.flipkart.com/search?q=${encodeURIComponent(cat.query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-blue-50 text-blue-700 rounded-xl py-2.5 text-sm font-semibold"
              >
                Flipkart 
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}