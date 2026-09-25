"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import UploadForm from "../uploadContent/UploadForm";
import type { ContentType, EditablePortfolioItem, PortfolioItem } from "@/types/content";
import styles from "./ContentManager.module.css";

export default function ContentManager({ type }: { type: ContentType }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editing, setEditing] = useState<EditablePortfolioItem | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<number | null>(null);
  async function load() {
    const response = await fetch(`/api/content?type=${type}&locale=es`, { cache: "no-store" });
    if (response.ok) setItems((await response.json()).items);
  }
  useEffect(() => {
    fetch(`/api/content?type=${type}&locale=es`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data) setItems(data.items); });
  }, [type]);

  async function remove(item: PortfolioItem) {
    if (!window.confirm(`¿Eliminar “${item.title}”? Esta acción no se puede deshacer.`)) return;
    const response = await fetch(`/api/content/${type}/${item.id}`, { method: "DELETE" });
    if (!response.ok) return toast.error("No se pudo eliminar la obra.");
    toast.success("Obra eliminada");
    setItems((current) => current.filter((value) => value.id !== item.id));
  }

  async function edit(item: PortfolioItem) {
    setLoadingEditId(item.id);
    const response = await fetch(`/api/content/${type}/${item.id}`, { cache: "no-store" });
    setLoadingEditId(null);
    if (!response.ok) return toast.error("No se pudo cargar la publicación.");
    const data = await response.json();
    setEditing(data.item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saved() {
    setEditing(null);
    await load();
  }

  return <section className={styles.manager}>
    <UploadForm key={editing ? `edit-${editing.id}` : "create"} type={type} editing={editing} onSaved={saved} onCancelEdit={() => setEditing(null)} />
    <div><h2>{type === "illustration" ? "Ilustraciones publicadas" : "Fotografías publicadas"}</h2>
      {items.length === 0 ? <p className={styles.empty}>Todavía no hay obras publicadas.</p> : <div className={styles.grid}>
        {items.map((item) => <article className={styles.card} key={item.id}>
          <Image src={item.image} alt={item.title} width={320} height={220} unoptimized />
          <div><h3>{item.title}</h3><p>{item.description}</p></div>
          <div className={styles.actions}>
            <button className={styles.edit} onClick={() => edit(item)} disabled={loadingEditId === item.id}>
              {loadingEditId === item.id ? "Cargando…" : "Editar"}
            </button>
            <button className={styles.delete} onClick={() => remove(item)}>Eliminar</button>
          </div>
        </article>)}
      </div>}
    </div>
  </section>;
}
