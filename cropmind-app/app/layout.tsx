import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import BottomNav from "../components/BottomNav";

export const metadata: Metadata = {
  title: "KisanScan",
  description: "AI-powered crop advisory for farmers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="pb-20">{children}</div>
        <BottomNav />
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.10/dist/tf-tflite.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
} 