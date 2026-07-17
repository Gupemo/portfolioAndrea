"use client";

import { createContext, useState, ReactNode, useMemo } from "react";
import { Locale, TranslationsContextType } from "@/types/frontend";
import es from "@/locales/es.json";
import en from "@/locales/en.json";

export const TranslationsContext =
  createContext<TranslationsContextType | undefined>(undefined);

export function TranslationsProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
  };

  const translate = useMemo(() => {
    return locale === "es" ? es : en;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      translate,
      changeLanguage,
    }),
    [locale, translate]
  );

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
}