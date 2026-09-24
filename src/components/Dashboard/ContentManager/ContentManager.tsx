"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import UploadForm from "../uploadContent/UploadForm";
import type { ContentType, PortfolioItem } from "@/types/content";
import styles from "./ContentManager.module.css";

export default function ContentManager({ type }: { type: ContentType }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
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

  return <section className={styles.manager}>
    <UploadForm type={type} onCreated={load} />
    <div><h2>{type === "illustration" ? "Ilustraciones publicadas" : "Fotografías publicadas"}</h2>
      {items.length === 0 ? <p className={styles.empty}>Todavía no hay obras publicadas.</p> : <div className={styles.grid}>
        {items.map((item) => <article className={styles.card} key={item.id}>
          <Image src={item.image} alt={item.title} width={320} height={220} unoptimized />
          <div><h3>{item.title}</h3><p>{item.description}</p></div>
          <button onClick={() => remove(item)}>Eliminar</button>
        </article>)}
      </div>}
    </div>
  </section>;
}
