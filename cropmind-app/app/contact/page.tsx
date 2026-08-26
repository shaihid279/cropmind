"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useToast } from "../../components/Toast";

export default function ContactPage() {
  const router = useRouter();
  const showToast = useToast();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!name.trim() || !message.trim()) {
      showToast("Naam aur message dono zaroori hain", "error");
      return;
    }
    setSending(true);
    await addDoc(collection(db, "contactMessages"), {
      name,
      message,
      createdAt: Timestamp.now(),
    });
    setSending(false);
    setName(""); 
    setMessage("");
    showToast("Message bhej diya! Hum jaldi sampark karenge 🙏");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">📞 Contact Us</h1>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Name</label>
          <input
            type="text"
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 bg-gray-50 focus:border-green-400 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Message</label>
          <textarea
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 h-28 bg-gray-50 focus:border-green-400 focus:outline-none resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 font-bold shadow-lg disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </main>
  );
}