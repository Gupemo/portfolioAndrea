"use client";
import { useTranslations } from "@/hooks/useTranslations";
import styles from "./LanguageSelector.module.css";
import { useRouter } from "next/navigation";

export default function LanguageSelector() {
  const { locale, changeLanguage } = useTranslations();
  const router = useRouter();
  const selectLanguage = (language: "es" | "en") => {
    changeLanguage(language);
    router.refresh();
  };
  return (
    <div className={styles.languageSelector}>
      <button
        className={locale === "es" ? styles.active : ""}
        onClick={() => selectLanguage("es")}
      >
        ES
      </button>

      <span>|</span>

      <button
        className={locale === "en" ? styles.active : ""}
        onClick={() => selectLanguage("en")}
      >
        EN
      </button>
    </div>
  );
}
