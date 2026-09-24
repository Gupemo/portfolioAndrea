import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export type AboutLocale = "es" | "en";

export async function getAbout(locale: AboutLocale) {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT content FROM about_translations WHERE locale = ? LIMIT 1",
    [locale],
  );
  return rows[0] ? String(rows[0].content) : "";
}

export async function getAllAbout() {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT locale, content FROM about_translations WHERE locale IN ('es', 'en')",
  );
  const result = { es: "", en: "" };
  for (const row of rows) {
    const locale = String(row.locale);
    if (locale === "es" || locale === "en") result[locale] = String(row.content);
  }
  return result;
}

export async function updateAbout(translations: Record<AboutLocale, string>) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const locale of ["es", "en"] as const) {
      await connection.execute(
        `INSERT INTO about_translations (locale, content) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE content = VALUES(content)`,
        [locale, translations[locale]],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
