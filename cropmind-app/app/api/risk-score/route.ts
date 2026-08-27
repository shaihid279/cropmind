import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const district = req.nextUrl.searchParams.get("district");
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  if (!process.env.OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: "Weather service not configured yet" },
      { status: 500 }
    );
  }

  try {
    let weatherUrl = "";

    if (lat && lon) {
      // GPS coordinates - most reliable
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else if (district) {
      // Fallback: try district name, with common renamed-city corrections
      const cityCorrections: Record<string, string> = {
        ahilyanagar: "Ahmednagar",
        dharashiv: "Osmanabad",
        sambhajinagar: "Aurangabad",
      };
      const normalized = district.trim().toLowerCase();
      const correctedName = cityCorrections[normalized] || district;
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        correctedName
      )},IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else {
      return NextResponse.json(
        { error: "Location ya district chahiye" },
        { status: 400 }
      );
    }

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (!weatherRes.ok) {
      return NextResponse.json(
        {
          error:
            weatherData.message === "city not found"
              ? "Ye area weather database mein nahi mila. Location use karke try karo."
              : "Weather data laane mein problem aayi",
        },
        { status: weatherRes.status }
      );
    }

    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const condition = weatherData.weather[0].main;
    const cityName = weatherData.name;

    let riskScore = 20;
    if (humidity >= 70) riskScore += 30;
    if (temp >= 20 && temp <= 32) riskScore += 25;
    if (condition === "Rain" || condition === "Drizzle") riskScore += 15;
    riskScore = Math.min(riskScore, 95);

    const riskLevel = riskScore >= 70 ? "high" : riskScore >= 45 ? "medium" : "low";

    return NextResponse.json({
      district: cityName,
      temp: Math.round(temp),
      humidity,
      condition,
      riskScore,
      riskLevel,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Kuch problem aayi, dobara try karo" },
      { status: 500 }
    );
  }
} 