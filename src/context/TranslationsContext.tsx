"use client";

import { createContext, useState, ReactNode, useMemo } from "react";
import { Locale, TranslationsContextType } from "@/types/frontend";
import es from "@/locales/es.json";
import en from "@/locales/en.json";

export const TranslationsContext =
  createContext<TranslationsContextType | undefined>(undefined);

export function TranslationsProvider({
  children,
  initialLocale = "en"
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const toggleLanguage = () => {
    setLocale(prev => {
      const next = prev === "es" ? "en" : "es";
      document.cookie = `locale=${next}; path=/; max-age=31536000`;
      return next;
    });
  };

  const translate = useMemo(() => {
    return locale === "es" ? es : en;
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    translate,
    toggleLanguage
  }), [locale, translate]);

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
}