import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const district = req.nextUrl.searchParams.get("district") || "Pune";

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        district
      )},IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    if (!weatherRes.ok) {
      return NextResponse.json(
        { error: "Weather data not available for this district" },
        { status: 404 }
      );
    }

    const weather = await weatherRes.json();
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const condition = weather.weather[0].main;

    // Simple agri-risk heuristic
    let riskScore = 20;
    if (humidity >= 70) riskScore += 30;
    if (temp >= 20 && temp <= 32) riskScore += 25;
    if (condition === "Rain" || condition === "Drizzle") riskScore += 15;
    riskScore = Math.min(riskScore, 95);

    const riskLevel = riskScore >= 70 ? "high" : riskScore >= 45 ? "medium" : "low";

    return NextResponse.json({
      district,
      temp: Math.round(temp),
      humidity,
      condition,
      riskScore,
      riskLevel,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
} 