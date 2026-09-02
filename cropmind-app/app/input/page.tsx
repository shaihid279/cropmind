"use client";

import { Suspense, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function InputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const crop = searchParams.get("crop") || "";
  const district = searchParams.get("district") || "";
  const lang = searchParams.get("lang") || "english";

  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const langMap: Record<string, string> = {
    english: "en-IN",
    hindi: "hi-IN",
    marathi: "mr-IN",
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
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuestion((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.start();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const runModelOnImage = async (file: File): Promise<number> => {
    // @ts-ignore
    const tflite = window.tflite;
    // @ts-ignore 
    const tf = window.tf;  
    tflite.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/'); 
    const model = await tflite.loadTFLiteModel("/model/cropmind_model.tflite");

    const imgElement = document.createElement("img");
    imgElement.src = URL.createObjectURL(file);
    await new Promise((resolve) => (imgElement.onload = resolve));

    const tensor = tf.browser
      .fromPixels(imgElement)
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .toFloat()
      .div(255.0);

    const output = model.predict(tensor);
    const data = (await output.data()) as unknown as number[];
    const predictedIndex = data.indexOf(Math.max(...Array.from(data)));

    tensor.dispose();
    output.dispose();

    return predictedIndex;
  };

  const handleSubmit = async () => {
    if (!question.trim() && !image) {
      alert("Sawaal likho ya photo upload karo!");
      return;
    }

    let predictedIndex = -1;

    if (image) {
      setLoading(true);
      try {
        predictedIndex = await runModelOnImage(image);
      } catch (err) {
        console.error(err);
alert("Photo analyze karne mein problem aayi: " + (err as any)?.message); 
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    router.push(
      `/result?crop=${crop}&district=${district}&lang=${lang}&question=${encodeURIComponent(
        question
      )}&predictedIndex=${predictedIndex}`
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
            {crop || "No crop"}
          </span>
          {district && (
            <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              📍 {district}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3">
          What's the problem? 🔍
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Type, speak, or upload a photo — we'll figure it out
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-7 w-full max-w-sm space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            💬 Your Question (optional)
          </label>
          <div className="relative">
            <textarea
              className="w-full border-2 border-gray-100 rounded-2xl p-3.5 pr-12 h-24 text-gray-700 bg-gray-50 focus:border-green-400 focus:bg-white focus:outline-none transition-all resize-none"
              placeholder="e.g. Mera crop ka patta yellow ho raha hai..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                listening
                  ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
              title="Voice input"
            >
              {listening ? "⏹" : "🎤"}
            </button>
          </div>
          {listening && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              Listening... bolo
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            📸 Upload Photo
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 rounded-2xl p-6 bg-green-50/50 hover:bg-green-50 cursor-pointer transition-colors overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-40 object-cover rounded-xl"
              />
            ) : (
              <>
                <span className="text-3xl mb-2">📷</span>
                <span className="text-sm text-green-700 font-medium">
                  Tap to select a photo
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 font-bold text-base shadow-lg shadow-green-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Analyzing Photo...
            </>
          ) : (
            "Get My Answer →"
          )}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full text-green-700 text-sm font-medium hover:underline"
        >
          ← Back to Home
        </button>
      </div>
    </main>
  );
}

export default function InputPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InputContent />
    </Suspense>
  );
} 