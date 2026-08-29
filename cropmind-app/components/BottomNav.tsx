"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "./LanguageContext";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const tabs = [
    { path: "/", icon: "🏠", label: t("navHome") },
    { path: "/my-crops", icon: "🌱", label: t("navMyCrops") },
    { path: "/input", icon: "📷", label: t("navScan") },
    { path: "/assistant", icon: "💬", label: t("navChat") },
    { path: "/profile", icon: "👤", label: t("navProfile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span
                className={`text-xl transition-transform ${
                  active ? "scale-110" : "opacity-50"
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-green-700" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}