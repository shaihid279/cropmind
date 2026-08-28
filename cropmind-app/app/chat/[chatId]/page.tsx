"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";

interface Msg {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  const otherUidFromUrl = searchParams.get("with");

  const [uid, setUid] = useState<string | null>(null);
  const [otherName, setOtherName] = useState("Farmer");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUid(u?.uid || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const initChat = async () => {
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists() && otherUidFromUrl) {
        const otherProfile = await getDoc(doc(db, "farmer_profiles", otherUidFromUrl));
        const myProfile = await getDoc(doc(db, "farmer_profiles", uid));

        const otherDisplayName = (otherProfile.data() as any)?.displayName || "Farmer";
        const myDisplayName = (myProfile.data() as any)?.displayName || "Farmer";

        await setDoc(chatRef, {
          participants: [uid, otherUidFromUrl],
          participantNames: {
            [uid]: myDisplayName,
            [otherUidFromUrl]: otherDisplayName,
          },
          lastMessage: "",
          createdAt: Timestamp.now(),
        });
        setOtherName(otherDisplayName);
      } else if (chatSnap.exists()) {
        const data = chatSnap.data() as any;
        const participants: string[] = data.participants || [];
        const otherUid = participants.find((p) => p !== uid);
        const names = data.participantNames || {};
        setOtherName((otherUid && names[otherUid]) || "Farmer");
      }
    };
    initChat();

    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Msg[]);
    });
    return () => unsub();
  }, [uid, chatId, otherUidFromUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !uid) return;
    const msgText = text;
    setText("");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: uid,
      text: msgText,
      timestamp: Timestamp.now(),
    });

    await setDoc(
      doc(db, "chats", chatId),
      { lastMessage: msgText, lastUpdated: Timestamp.now() },
      { merge: true }
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col">
      <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-green-700 text-xl">
          ←
        </button>
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
          {otherName[0]?.toUpperCase()}
        </div>
        <h1 className="font-bold text-gray-800 text-sm">{otherName}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === uid ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                m.senderId === uid
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-sm sticky bottom-20">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl border-2 border-gray-100 p-2">
          <input
            type="text"
            className="flex-1 bg-transparent px-2 outline-none text-sm"
            placeholder="Message likho..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center"
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
} 