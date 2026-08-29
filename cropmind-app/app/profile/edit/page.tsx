"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { uploadImageToCloudinary } from "../../../lib/uploadImage";
import { useToast } from "../../../components/Toast";

export default function EditProfilePage() {
  const router = useRouter();
  const showToast = useToast();
  const [uid, setUid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUid(u.uid);
        setDisplayName(u.displayName || "");
        const snap = await getDoc(doc(db, "farmer_profiles", u.uid));
        if (snap.exists()) {
          const data = snap.data() as any;
          setDisplayName(data.displayName || u.displayName || "");
          setBio(data.bio || "");
          setPhotoURL(data.photoURL || "");
        }
      }
    });
    return () => unsub();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!uid) return;
    setSaving(true);

    let finalPhotoURL = photoURL;
    if (photoFile) {
      try {
        finalPhotoURL = await uploadImageToCloudinary(photoFile);
      } catch (err) {
        showToast("Photo upload fail hui, dobara try karo", "error");
        setSaving(false);
        return;
      }
    }

    await setDoc(
      doc(db, "farmer_profiles", uid),
      { displayName, bio, photoURL: finalPhotoURL },
      { merge: true }
    );
    setSaving(false);
    showToast("Profile update ho gaya! ✅");
    router.push("/profile");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6">
      <button onClick={() => router.back()} className="text-green-700 text-sm font-medium mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">✏️ Edit Profile</h1>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-6 space-y-4">
        <div className="flex flex-col items-center">
          <label className="cursor-pointer relative">
            {preview || photoURL ? (
              <img
                src={preview || photoURL}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl border-4 border-green-100">
                📷
              </div>
            )}
            <span className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs">
              ✏️
            </span>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </label>
          <p className="text-xs text-gray-400 mt-2">Photo change karne ke liye tap karo</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Naam</label>
          <input
            type="text"
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 bg-gray-50 focus:border-green-400 focus:outline-none"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Bio (dusre farmers ko dikhega)
          </label>
          <textarea
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 h-24 bg-gray-50 focus:border-green-400 focus:outline-none resize-none"
            placeholder="e.g. 5 saal se soybean aur cotton uga raha hoon..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 font-bold shadow-lg disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </main>
  );
}