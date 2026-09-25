"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Image from "next/image";
import { toast } from "react-toastify";
import styles from "./UploadForm.module.css";
import type { ContentType, EditablePortfolioItem } from "@/types/content";

type Locale = "es" | "en";
type FormValues = {
  image: FileList;
  signature: FileList;
  watermarkType: "none" | "text" | "signature";
  watermarkPosition: "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";
  translations: Record<Locale, { title: string; description: string }>;
};

type Props = {
  type: ContentType;
  editing?: EditablePortfolioItem | null;
  onSaved?: () => void;
  onCancelEdit?: () => void;
};

export default function UploadForm({ type, editing, onSaved, onCancelEdit }: Props) {
  const [locale, setLocale] = useState<Locale>("es");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const { register, handleSubmit, reset, getValues, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      watermarkType: editing?.watermarkType ?? "text",
      watermarkPosition: editing?.watermarkPosition ?? "bottom-right",
      translations: editing?.translations,
    },
  });
  const watermarkType = useWatch({ control, name: "watermarkType" });

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  function addWatermarkFields(form: FormData, values: FormValues) {
    form.set("watermarkType", values.watermarkType);
    form.set("watermarkPosition", values.watermarkPosition);
    if (values.signature?.[0]) form.set("signature", values.signature[0]);
  }

  async function generatePreview() {
    const values = getValues();
    if (!values.image?.[0]) return toast.error("Selecciona primero una imagen.");
    const form = new FormData();
    if (values.image?.[0]) form.set("image", values.image[0]);
    addWatermarkFields(form, values);
    setPreviewing(true);
    const response = await fetch("/api/watermark/preview", { method: "POST", body: form });
    setPreviewing(false);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (error.error === "SIGNATURE_REQUIRED") return toast.error("Sube primero la firma en PNG.");
      if (error.error === "INVALID_IMAGE") return toast.error("La imagen no es válida o supera los 10 MB.");
      if (error.error === "INVALID_SIGNATURE") return toast.error("La firma debe ser un PNG de hasta 3 MB.");
      return toast.error("No se pudo procesar la imagen. Revisa el registro del servidor.");
    }
    setPreviewUrl(URL.createObjectURL(await response.blob()));
  }

  async function onSubmit(values: FormValues) {
    const form = new FormData();
    form.set("type", type);
    form.set("image", values.image[0]);
    addWatermarkFields(form, values);
    for (const language of ["es", "en"] as const) {
      form.set(`title_${language}`, values.translations[language].title);
      form.set(`description_${language}`, values.translations[language].description);
    }
    const response = await fetch(
      editing ? `/api/content/${type}/${editing.id}` : "/api/content",
      { method: editing ? "PUT" : "POST", body: form },
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (error.error === "ORIGINAL_IMAGE_REQUIRED") {
        return toast.error("Esta publicación es antigua. Selecciona de nuevo la imagen para aplicar la marca de agua.");
      }
      if (error.error === "MISSING_TRANSLATIONS") {
        return toast.error("Completa el título y la descripción en Español y English.");
      }
      return toast.error("No se pudo guardar. Revisa los campos y la imagen.");
    }
    toast.success(editing ? "Publicación actualizada" : type === "illustration" ? "Ilustración guardada" : "Fotografía guardada");
    reset();
    setPreviewUrl(null);
    setLocale("es");
    onSaved?.();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div><p className={styles.eyebrow}>{editing ? "Editar publicación" : "Nueva publicación"}</p><h2>{editing ? `Editar “${editing.title}”` : type === "illustration" ? "Añadir ilustración" : "Añadir fotografía"}</h2></div>
      {editing && <div className={styles.currentImage}>
        <p>Imagen publicada actualmente</p>
        <Image src={editing.image} alt={editing.title} width={320} height={220} unoptimized />
      </div>}
      <label className={styles.field}>{editing ? "Nueva imagen (opcional)" : "Imagen"} (máximo 10 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" {...register("image", { required: !editing })} />
        {errors.image && <span>Selecciona una imagen.</span>}
      </label>
      <fieldset className={styles.watermark}>
        <legend>Marca de agua</legend>
        <label className={styles.field}>Tipo
          <select {...register("watermarkType")}>
            <option value="none">Sin marca de agua</option>
            <option value="text">Texto “Andrea Larrumbide”</option>
            <option value="signature">Firma PNG</option>
          </select>
        </label>
        {watermarkType !== "none" && <label className={styles.field}>Posición
          <select {...register("watermarkPosition")}>
            <option value="top-left">Arriba a la izquierda</option>
            <option value="top-right">Arriba a la derecha</option>
            <option value="center">Centro</option>
            <option value="bottom-left">Abajo a la izquierda</option>
            <option value="bottom-right">Abajo a la derecha</option>
          </select>
        </label>}
        {watermarkType === "signature" && <label className={styles.field}>Firma con fondo transparente
          <input type="file" accept="image/png" {...register("signature")} />
          <small>Solo es obligatoria la primera vez. La última firma subida se reutilizará.</small>
        </label>}
        <button className={styles.previewButton} type="button" onClick={generatePreview} disabled={previewing}>
          {previewing ? "Generando…" : "Generar vista previa"}
        </button>
      </fieldset>
      {previewUrl && <div className={styles.preview}>
        <p>Así se publicará la imagen</p>
        <Image src={previewUrl} alt="Vista previa con marca de agua" width={900} height={700} unoptimized />
      </div>}
      <div className={styles.tabs} aria-label="Idioma de la obra">
        <button type="button" className={locale === "es" ? styles.active : ""} onClick={() => setLocale("es")}>Español</button>
        <button type="button" className={locale === "en" ? styles.active : ""} onClick={() => setLocale("en")}>English</button>
      </div>
      <label key={`title-${locale}`} className={styles.field}>Título en {locale === "es" ? "español" : "inglés"}
        <input {...register(`translations.${locale}.title`, { required: true, maxLength: 255 })} />
        {errors.translations?.[locale]?.title && <span>Escribe el título en ambos idiomas.</span>}
      </label>
      <label key={`description-${locale}`} className={styles.field}>Descripción en {locale === "es" ? "español" : "inglés"}
        <textarea rows={5} {...register(`translations.${locale}.description`, { required: true })} />
        {errors.translations?.[locale]?.description && <span>Escribe la descripción en ambos idiomas.</span>}
      </label>
      <p className={styles.hint}>Completa las pestañas Español y English antes de guardar.</p>
      <div className={styles.actions}>
        <button className={styles.submit} disabled={isSubmitting}>{isSubmitting ? "Guardando…" : editing ? "Guardar cambios" : "Guardar obra"}</button>
        {editing && <button className={styles.cancel} type="button" onClick={onCancelEdit} disabled={isSubmitting}>Cancelar</button>}
      </div>
    </form>
  );
}
