"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

const ToastContext = createContext<
  (message: string, type?: ToastItem["type"]) => void
>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastItem["type"] = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 z-[100] px-6 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-5 py-3 rounded-2xl shadow-lg text-sm font-medium text-white max-w-sm w-full text-center ${
              t.type === "success"
                ? "bg-green-600"
                : t.type === "error"
                ? "bg-red-600"
                : "bg-gray-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}