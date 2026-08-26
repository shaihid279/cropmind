"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useToast } from "../../components/Toast";

export default function SettingsPage() {
  const router = useRouter();
  const showToast = useToast();

  const handleLogout = async () => {
    await signOut(auth);
    showToast("Logged out successfully");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">⚙️ Settings</h1>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white divide-y divide-gray-100 overflow-hidden mb-4">
        <div className="p-4 flex items-center justify-between">
          <span className="text-gray-700 font-medium">🌐 Language</span>
          <span className="text-gray-400 text-sm">English (coming soon)</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span className="text-gray-700 font-medium">🔔 Notifications</span>
          <span className="text-green-600 text-sm font-semibold">On</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span className="text-gray-700 font-medium">📱 App Version</span>
          <span className="text-gray-400 text-sm">1.0.0</span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 rounded-2xl p-4 font-semibold hover:bg-red-100 transition-colors"
      >
        Logout
      </button>
    </main>
  );
} 