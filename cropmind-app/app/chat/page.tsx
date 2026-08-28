"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";

interface ChatThread {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
}

export default function ChatListPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUid(u?.uid || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "chats"), where("participants", "array-contains", uid));
    const unsub = onSnapshot(q, (snap) => {
      setThreads(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ChatThread[]);
    });
    return () => unsub();
  }, [uid]);

  if (!uid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl">🔒</span>
        <h1 className="text-xl font-bold text-gray-800 mt-3">Login Required</h1>
        <button
          onClick={() => router.push("/profile")}
          className="mt-4 bg-green-600 text-white rounded-2xl px-6 py-3 font-bold"
        >
          Login →
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">💬 Messages</h1>

      {threads.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-16">
          Koi conversation nahi hai. Community se kisi farmer se baat shuru karo.
        </p>
      ) : (
        <div className="space-y-2">
          {threads.map((t) => {
            const otherUid = t.participants.find((p) => p !== uid);
            const otherName = (otherUid && t.participantNames?.[otherUid]) || "Farmer";
            return (
              <div
                key={t.id}
                onClick={() => router.push(`/chat/${t.id}`)}
                className="bg-white/80 rounded-2xl p-4 shadow-sm border border-white flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                  {otherName[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{otherName}</p>
                  <p className="text-xs text-gray-500 truncate">{t.lastMessage || "..."}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
} 