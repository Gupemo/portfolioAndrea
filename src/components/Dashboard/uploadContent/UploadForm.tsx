"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styles from "./UploadForm.module.css";
import type { ContentType } from "@/types/content";

type Locale = "es" | "en";
type FormValues = {
  image: FileList;
  translations: Record<Locale, { title: string; description: string }>;
};

export default function UploadForm({ type, onCreated }: { type: ContentType; onCreated?: () => void }) {
  const [locale, setLocale] = useState<Locale>("es");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    const form = new FormData();
    form.set("type", type);
    form.set("image", values.image[0]);
    for (const language of ["es", "en"] as const) {
      form.set(`title_${language}`, values.translations[language].title);
      form.set(`description_${language}`, values.translations[language].description);
    }
    const response = await fetch("/api/content", { method: "POST", body: form });
    if (!response.ok) return toast.error("No se pudo guardar. Revisa los campos y la imagen.");
    toast.success(type === "illustration" ? "Ilustración guardada" : "Fotografía guardada");
    reset();
    setLocale("es");
    onCreated?.();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div><p className={styles.eyebrow}>Nueva publicación</p><h2>{type === "illustration" ? "Añadir ilustración" : "Añadir fotografía"}</h2></div>
      <label className={styles.field}>Imagen (máximo 10 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" {...register("image", { required: true })} />
        {errors.image && <span>Selecciona una imagen.</span>}
      </label>
      <div className={styles.tabs} aria-label="Idioma de la obra">
        <button type="button" className={locale === "es" ? styles.active : ""} onClick={() => setLocale("es")}>Español</button>
        <button type="button" className={locale === "en" ? styles.active : ""} onClick={() => setLocale("en")}>English</button>
      </div>
      <label className={styles.field}>Título en {locale === "es" ? "español" : "inglés"}
        <input {...register(`translations.${locale}.title`, { required: true, maxLength: 255 })} />
        {errors.translations?.[locale]?.title && <span>Escribe el título en ambos idiomas.</span>}
      </label>
      <label className={styles.field}>Descripción en {locale === "es" ? "español" : "inglés"}
        <textarea rows={5} {...register(`translations.${locale}.description`, { required: true })} />
        {errors.translations?.[locale]?.description && <span>Escribe la descripción en ambos idiomas.</span>}
      </label>
      <p className={styles.hint}>Completa las pestañas Español y English antes de guardar.</p>
      <button className={styles.submit} disabled={isSubmitting}>{isSubmitting ? "Guardando…" : "Guardar obra"}</button>
    </form>
  );
}
