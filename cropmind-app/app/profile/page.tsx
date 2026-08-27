"use client";

import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useToast } from "../../components/Toast";

export default function ProfilePage() {
  const showToast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  const handleAuth = async () => {
    setError("");
    if (!email || !password || (isSignup && !name.trim())) {
      setError("Sab fields zaroori hain");
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        showToast("Account ban gaya! Welcome " + name);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Welcome back!");
      }
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    showToast("Logged out");
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
      </main>
    );
  }

  if (user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col items-center p-6 pt-16">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-green-200 mb-4">
          {(user.displayName || user.email || "U")[0].toUpperCase()}
        </div>
        <h1 className="text-xl font-bold text-gray-800">{user.displayName || "Farmer"}</h1>
        <p className="text-sm text-gray-500 mb-8">{user.email}</p>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white w-full max-w-sm divide-y divide-gray-100 overflow-hidden">
          <ProfileLink icon="✏️" label="Edit Profile" href="/profile/edit" />
<ProfileLink icon="👥" label="Farmer Community" href="/community" />
<ProfileLink icon="💬" label="Messages" href="/chat" />
<ProfileLink icon="📊" label="Crop Trends" href="/trends" /> 

          <ProfileLink icon="🌱" label="My Crops" href="/my-crops" />
          <ProfileLink icon="🛒" label="Shop Supplies" href="/shop" />
          <ProfileLink icon="⚙️" label="Settings" href="/settings" />
          <ProfileLink icon="❓" label="Help & Support" href="/help" />
          <ProfileLink icon="📞" label="Contact Us" href="/contact" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full max-w-sm mt-6 bg-red-50 text-red-600 rounded-2xl p-4 font-semibold hover:bg-red-100 transition-colors"
        >
          Logout
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 mb-3">
          <span className="text-3xl">👤</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-green-100 border border-white p-7 w-full max-w-sm space-y-4">
        {error && <p className="text-red-600 text-xs bg-red-50 p-2.5 rounded-xl">{error}</p>}

        {isSignup && (
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">👤 Your Name</label>
            <input
              type="text"
              className="w-full border-2 border-gray-100 rounded-2xl p-3.5 bg-gray-50 focus:border-green-400 focus:outline-none"
              placeholder="Ramesh Patil"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">📧 Email</label>
          <input
            type="email"
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 bg-gray-50 focus:border-green-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">🔒 Password</label>
          <input
            type="password"
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 bg-gray-50 focus:border-green-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 font-bold shadow-lg disabled:opacity-60"
        >
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>

        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
          className="w-full text-green-700 text-sm font-medium hover:underline"
        >
          {isSignup ? "Already have an account? Login" : "New here? Create an account"}
        </button>
      </div>
    </main>
  );
}

function ProfileLink({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 p-4 hover:bg-green-50 transition-colors">
      <span className="text-xl">{icon}</span>
      <span className="text-gray-700 font-medium flex-1">{label}</span>
      <span className="text-gray-300">›</span>
    </a>
  ); 
} 