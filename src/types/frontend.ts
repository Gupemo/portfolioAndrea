
import es from "@/locales/es.json";
// Translations
export type Translations = typeof es;
export type Locale = "es" | "en";

export type TranslationsContextType = {
  locale: Locale;
  translate: Translations;
  toggleLanguage: () => void;
};

export type ContactType = {
  name: string,
  email: string,
  contactMessage: string
}