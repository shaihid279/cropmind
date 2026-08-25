"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as tf from "@tensorflow/tfjs";
import { TFLiteModel, loadTFLiteModel } from "@tensorflow/tfjs-tflite";

function InputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const crop = searchParams.get("crop") || "";
  const district = searchParams.get("district") || "";
  const lang = searchParams.get("lang") || "english";

  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const runModelOnImage = async (file: File): Promise<number> => {
    const model: TFLiteModel = await loadTFLiteModel("/model/cropmind_model.tflite");

    const imgElement = document.createElement("img");
    imgElement.src = URL.createObjectURL(file);
    await new Promise((resolve) => (imgElement.onload = resolve));

    const tensor = tf.browser
      .fromPixels(imgElement)
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .toFloat()
      .div(255.0);

    const output = model.predict(tensor as any) as unknown as tf.Tensor;
    const data = await output.data();
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
        alert("Photo analyze karne mein problem aayi, dobara try karo.");
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
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-2">
        🌾 Ask Your Question
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Crop: {crop || "Not selected"} | District: {district || "Not entered"}
      </p>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Your Question (optional)
          </label>
          <textarea
            className="w-full border rounded-lg p-2 h-24"
            placeholder="e.g. Mera crop ka patta yellow ho raha hai, kya karu?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Photo (crop disease detect karega)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-lg p-3 font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Analyzing Photo..." : "Submit"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full text-green-700 text-sm underline"
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