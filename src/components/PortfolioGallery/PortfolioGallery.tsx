import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { getContent } from "@/services/content.service";
import type { ContentType, Locale } from "@/types/content";
import styles from "./PortfolioGallery.module.css";

export default async function PortfolioGallery({ type }: { type: ContentType }) {
  const locale: Locale = (await cookies()).get("locale")?.value === "en" ? "en" : "es";
  const items = await getContent(type, locale);
  const copy = locale === "es"
    ? { illustrations: "Ilustraciones", pictures: "Fotografía", empty: "Próximamente habrá nuevos trabajos.", home: "Volver al inicio" }
    : { illustrations: "Illustrations", pictures: "Photography", empty: "New work is coming soon.", home: "Back home" };

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href="/">← {copy.home}</Link>
      <p>Andrea Larrumbide</p>
      <h1>{type === "illustration" ? copy.illustrations : copy.pictures}</h1>
      <nav>
        <Link className={type === "illustration" ? styles.active : ""} href="/illustrations">{copy.illustrations}</Link>
        <Link className={type === "picture" ? styles.active : ""} href="/photos">{copy.pictures}</Link>
      </nav>
    </header>
    {items.length === 0 ? <p className={styles.empty}>{copy.empty}</p> : <section className={styles.grid}>
      {items.map((item) => <article className={styles.card} key={item.id}>
        <div className={styles.image}><Image src={item.image} alt={item.title} width={900} height={700} unoptimized /></div>
        <div className={styles.text}><h2>{item.title}</h2><p>{item.description}</p></div>
      </article>)}
    </section>}
  </main>;
}
