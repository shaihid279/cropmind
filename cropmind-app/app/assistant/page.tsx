"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

const langMap: Record<string, string> = {
  english: "en-IN",
  hindi: "hi-IN",
  marathi: "mr-IN",
};

export default function AssistantPage() {
  const router = useRouter();
  const [lang, setLang] = useState("english");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Namaste! Main KisanScan AI hoon. Aap mujhse kheti se juda koi bhi sawaal pooch sakte ho — bol kar ya type karke.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("kisanscan_lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang] || "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceInput = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = langMap[lang] || "en-IN";
    recognitionRef.current = recognition;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, lang }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      speak(data.reply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Connection problem. Dobara try karo." },
      ]);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col">
      <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-green-700 text-xl">
          ←
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-sm">KisanScan AI</h1>
          <p className="text-xs text-green-600">● Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3.5 rounded-2xl rounded-bl-sm shadow-sm">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-sm sticky bottom-20">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl border-2 border-gray-100 p-2">
          <input
            type="text"
            className="flex-1 bg-transparent px-2 outline-none text-sm"
            placeholder="Sawaal type karo ya bolo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={toggleVoiceInput}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-green-100 text-green-700"
            }`}
          >
            {listening ? "⏹" : "🎤"}
          </button>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}  