import Link from "next/link";
import { cookies } from "next/headers";
import { getContent } from "@/services/content.service";
import type { ContentType, Locale } from "@/types/content";
import styles from "./PortfolioGallery.module.css";
import GalleryGrid from "./GalleryGrid";

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
    {items.length === 0 ? <p className={styles.empty}>{copy.empty}</p> : <GalleryGrid items={items} />}
  </main>;
}
