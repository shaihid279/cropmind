import { NextRequest, NextResponse } from "next/server";
import { farmingKnowledge } from "../../../data/farmingKnowledge";

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
              content: `You are KisanScan AI, an expert farming assistant for Indian farmers, especially in Maharashtra. Use the following knowledge base as your primary reference when answering questions:

${farmingKnowledge}

Instructions:
- Give short, practical, actionable advice (under 100 words)
- Use the knowledge base above when relevant to the question
- If asked about government schemes, contacts, or market info, use the exact real details given above
- If a question is outside farming (unrelated topics), politely redirect to farming topics
- Be warm and encouraging, like a helpful local agricultural expert
- ${langInstruction}`,
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