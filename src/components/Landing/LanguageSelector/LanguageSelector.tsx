"use client";
import { useTranslations } from "@/hooks/useTranslations";
import styles from "./LanguageSelector.module.css";

export default function LanguageSelector() {
  const { locale, changeLanguage } = useTranslations();
  return (
    <div className={styles.languageSelector}>
      <button
        className={locale === "es" ? styles.active : ""}
        onClick={() => changeLanguage("es")}
      >
        ES
      </button>

      <span>|</span>

      <button
        className={locale === "en" ? styles.active : ""}
        onClick={() => {console.log("button");
          changeLanguage("en")}}
      >
        EN
      </button>
    </div>
  );
}
