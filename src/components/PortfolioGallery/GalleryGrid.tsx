"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PortfolioItem } from "@/types/content";
import styles from "./PortfolioGallery.module.css";

export default function GalleryGrid({ items }: { items: PortfolioItem[] }) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [selected]);

  return <>
    <section className={styles.grid}>
      {items.map((item) => <button
        className={styles.card}
        key={item.id}
        onClick={() => setSelected(item)}
        aria-label={`Ver ${item.title}`}
      >
        <span className={styles.image}>
          <Image src={item.image} alt={item.title} width={900} height={700} unoptimized />
          <span className={styles.viewHint}>Ver obra</span>
        </span>
        <span className={styles.text}><strong>{item.title}</strong><span>{item.description}</span></span>
      </button>)}
    </section>

    {selected && <div className={styles.modalOverlay} role="presentation" onMouseDown={() => setSelected(null)}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className={styles.close} onClick={() => setSelected(null)} aria-label="Cerrar visor">×</button>
        <div className={styles.modalImage}>
          <Image src={selected.image} alt={selected.title} width={1600} height={1200} unoptimized priority />
        </div>
        <div className={styles.modalText}>
          <h2 id="portfolio-modal-title">{selected.title}</h2>
          <p>{selected.description}</p>
        </div>
      </section>
    </div>}
  </>;
}
