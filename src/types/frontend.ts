
import es from "@/locales/es.json";
// Translations
export type Translations = typeof es;
export type Locale = "es" | "en";

export type TranslationsContextType = {
  locale: Locale;
  translate: Translations;
  changeLanguage: (locale: Locale) => void;
};

export type ContactType = {
  name: string,
  email: string,
  contactMessage: string,
  privacyAccepted: boolean
}
export type Contact = {
  id: number,
  name: string,
  email: string,
  message: string,
  privacyAcceptedAt: string | null,
  privacyVersion: string | null,
}
