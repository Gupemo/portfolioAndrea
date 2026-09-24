"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styles from "./AboutEditor.module.css";

type Locale = "es" | "en";
type Values = { es: string; en: string };

export default function AboutEditor() {
  const [locale, setLocale] = useState<Locale>("es");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>();

  useEffect(() => {
    fetch("/api/about?all=true")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data) reset(data.translations); })
      .catch(() => toast.error("No se pudo cargar el texto."));
  }, [reset]);

  async function save(values: Values) {
    const response = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) return toast.error("Completa el texto en español y en inglés.");
    toast.success("Texto actualizado correctamente");
  }

  return <section className={styles.wrapper}>
    <form className={styles.form} onSubmit={handleSubmit(save)}>
      <div><p className={styles.eyebrow}>Contenido de la portada</p><h1>Sobre mí</h1></div>
      <p className={styles.help}>Este texto aparecerá en el modal «Sobre mí» de la página principal.</p>
      <div className={styles.tabs}>
        <button type="button" className={locale === "es" ? styles.active : ""} onClick={() => setLocale("es")}>Español</button>
        <button type="button" className={locale === "en" ? styles.active : ""} onClick={() => setLocale("en")}>English</button>
      </div>
      <label>Texto en {locale === "es" ? "español" : "inglés"}
        <textarea rows={14} maxLength={10000} {...register(locale, { required: true })} />
        {errors[locale] && <span>El texto es obligatorio en ambos idiomas.</span>}
      </label>
      <p className={styles.hint}>Los saltos de línea se conservarán en la web.</p>
      <button className={styles.submit} disabled={isSubmitting}>{isSubmitting ? "Guardando…" : "Guardar cambios"}</button>
    </form>
  </section>;
}
