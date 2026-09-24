"use client";

import { useEffect } from "react";
import styles from "./AboutModal.module.css";

export default function AboutModal({ content, title, onClose }: { content: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeWithEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [onClose]);

  return <div className={styles.overlay} onMouseDown={onClose}>
    <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="about-title" onMouseDown={(event) => event.stopPropagation()}>
      <button className={styles.close} onClick={onClose} aria-label="Cerrar">×</button>
      <p className={styles.eyebrow}>Andrea Larrumbide</p>
      <h2 id="about-title">{title}</h2>
      <div className={styles.content}>{content}</div>
    </section>
  </div>;
}
