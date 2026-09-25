"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/types/frontend";
import styles from "./PrivacyModal.module.css";

type PrivacyPolicy = {
  content: string;
  version: string;
};

type Props = {
  locale: Locale;
  onClose: () => void;
};

export default function PrivacyModal({ locale, onClose }: Props) {
  const [policy, setPolicy] = useState<PrivacyPolicy | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPolicy() {
      try {
        const response = await fetch(`/api/privacy?locale=${locale}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("PRIVACY_POLICY_LOAD_FAILED");

        const result = await response.json();
        setPolicy(result.policy);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setHasError(true);
        }
      }
    }

    loadPolicy();
    return () => controller.abort();
  }, [locale]);

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [onClose]);

  const title = locale === "es" ? "Política de privacidad" : "Privacy Policy";

  return (
    <div
      className={styles.overlay}
      onMouseDown={onClose}
      onClick={(event) => event.stopPropagation()}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={locale === "es" ? "Cerrar" : "Close"}
        >
          ×
        </button>
        <h2 id="privacy-title">{title}</h2>

        {!policy && !hasError && (
          <p>{locale === "es" ? "Cargando…" : "Loading…"}</p>
        )}
        {hasError && (
          <p className={styles.error}>
            {locale === "es"
              ? "No se pudo cargar la política de privacidad."
              : "The Privacy Policy could not be loaded."}
          </p>
        )}
        {policy && (
          <>
            <div className={styles.content}>{policy.content}</div>
            <p className={styles.version}>
              {locale === "es" ? "Versión" : "Version"}: {policy.version}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
