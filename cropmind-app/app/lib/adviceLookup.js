import adviceDb from "../data/advice_db.json";
import labels from "../data/labels.json";

// predictedIndex = model ka output number (0, 1, 2...)
// language = "english" | "hindi" | "marathi"
export function getAdviceByIndex(predictedIndex, language = "english") {
  const key = labels[predictedIndex];
  const entry = adviceDb[key];

  if (!entry) {
    return {
      key: key || "unknown",
      crop: "Unknown",
      disease: "Not Found",
      severity: "-",
      symptoms: "Is disease ka data abhi database mein nahi hai.",
      treatment: "-",
      prevention: "-",
      sowing: "-",
      irrigation: "-",
      fertilizer: "-",
    };
  }

  return {
    key,
    crop: entry.crop[language] || entry.crop.english,
    disease: entry.disease[language] || entry.disease.english,
    severity: entry.severity[language] || entry.severity.english,
    symptoms: entry.symptoms[language] || entry.symptoms.english,
    treatment: entry.treatment[language] || entry.treatment.english,
    prevention: entry.prevention[language] || entry.prevention.english,
    sowing: entry.sowing[language] || entry.sowing.english,
    irrigation: entry.irrigation[language] || entry.irrigation.english,
    fertilizer: entry.fertilizer[language] || entry.fertilizer.english,
  };
} 