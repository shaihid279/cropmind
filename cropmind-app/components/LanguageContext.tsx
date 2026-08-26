"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations, Lang } from "../lib/i18n";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LangContextType>({
  lang: "english",
  setLang: () => {},
  t: (key) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("english");

  useEffect(() => {
    const saved = localStorage.getItem("kisanscan_lang") as Lang | null;
    if (saved) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("kisanscan_lang", l);
  };

  const t = (key: string) => translations[lang][key] || translations.english[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
} 