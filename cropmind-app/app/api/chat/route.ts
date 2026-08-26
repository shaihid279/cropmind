import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, lang } = await req.json();

    const langInstruction =
      lang === "hindi"
        ? "Reply only in Hindi (Devanagari script)."
        : lang === "marathi"
        ? "Reply only in Marathi (Devanagari script)."
        : "Reply in English.";

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are KisanScan AI, a friendly farming assistant for Indian farmers. Give short, practical, actionable advice about crops, fertilizers, pests, and farming techniques. Keep answers under 100 words. ${langInstruction}`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, mujhe jawab nahi mil paya. Dobara try karo.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { reply: "Kuch problem aayi. Dobara try karo." },
      { status: 500 }
    );
  }
} 