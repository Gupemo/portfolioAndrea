"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styles from "./PrivacyEditor.module.css";

type Locale = "es" | "en";
type Values = { es: string; en: string };

export default function PrivacyEditor() {
  const [locale, setLocale] = useState<Locale>("es");
  const [version, setVersion] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>();

  useEffect(() => {
    fetch("/api/privacy?all=true")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data) return;
        reset({ es: data.policies.es, en: data.policies.en });
        setVersion(data.policies.version);
      })
      .catch(() => toast.error("No se pudo cargar la política."));
  }, [reset]);

  async function save(values: Values) {
    if (!window.confirm("¿Guardar una nueva versión de la Política de privacidad?")) return;
    const response = await fetch("/api/privacy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) return toast.error("Completa la política en ambos idiomas.");
    const data = await response.json();
    setVersion(data.version);
    toast.success("Política de privacidad actualizada");
  }

  return <section className={styles.wrapper}>
    <form className={styles.form} onSubmit={handleSubmit(save)}>
      <div><p className={styles.eyebrow}>Contenido legal</p><h1>Política de privacidad</h1></div>
      <p className={styles.help}>El formulario guardará la versión aceptada por cada persona. Revisa el texto antes de publicar cambios.</p>
      {version && <p className={styles.version}>Versión vigente: {version}</p>}
      <div className={styles.tabs}>
        <button type="button" className={locale === "es" ? styles.active : ""} onClick={() => setLocale("es")}>Español</button>
        <button type="button" className={locale === "en" ? styles.active : ""} onClick={() => setLocale("en")}>English</button>
      </div>
      <label>Texto legal en {locale === "es" ? "español" : "inglés"}
        <textarea rows={24} maxLength={50000} {...register(locale, { required: true })} />
        {errors[locale] && <span>La política es obligatoria en ambos idiomas.</span>}
      </label>
      <button className={styles.submit} disabled={isSubmitting}>{isSubmitting ? "Guardando…" : "Guardar nueva versión"}</button>
    </form>
  </section>;
}
