import { db } from "@/lib/db";
import type { ContentType, Locale, PortfolioItem } from "@/types/content";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const config = {
  illustration: {
    table: "illustrations",
    translationTable: "illustration_translations",
    id: "illustration_id",
  },
  picture: {
    table: "pictures",
    translationTable: "picture_translations",
    id: "picture_id",
  },
} as const;

export function isContentType(value: string): value is ContentType {
  return value === "illustration" || value === "picture";
}

export async function getContent(type: ContentType, locale: Locale) {
  const current = config[type];
  const fallbackLocale: Locale = locale === "es" ? "en" : "es";
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT c.${current.id} AS id, c.image, c.created_at AS createdAt,
      COALESCE(t.title, fallback.title) AS title,
      COALESCE(t.description, fallback.description) AS description
    FROM ${current.table} c
    LEFT JOIN ${current.translationTable} t
      ON t.${current.id} = c.${current.id} AND t.locale = ?
    LEFT JOIN ${current.translationTable} fallback
      ON fallback.${current.id} = c.${current.id} AND fallback.locale = ?
    ORDER BY c.created_at DESC, c.${current.id} DESC`,
    [locale, fallbackLocale],
  );

  return rows.map((row) => ({ ...row, type })) as PortfolioItem[];
}

export async function createContent(
  type: ContentType,
  image: string,
  originalImage: string,
  watermarkType: string,
  watermarkPosition: string,
  translations: Record<Locale, { title: string; description: string }>,
) {
  const current = config[type];
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO ${current.table} (image, original_image, watermark_type, watermark_position)
       VALUES (?, ?, ?, ?)`,
      [image, originalImage, watermarkType, watermarkPosition],
    );

    for (const locale of ["es", "en"] as const) {
      const translation = translations[locale];
      await connection.execute(
        `INSERT INTO ${current.translationTable}
          (${current.id}, locale, title, description) VALUES (?, ?, ?, ?)`,
        [result.insertId, locale, translation.title, translation.description],
      );
    }

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteContent(type: ContentType, id: number) {
  const current = config[type];
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT image, original_image AS originalImage FROM ${current.table} WHERE ${current.id} = ?`,
    [id],
  );
  if (!rows[0]) return null;

  await db.execute(`DELETE FROM ${current.table} WHERE ${current.id} = ?`, [id]);
  return { image: String(rows[0].image), originalImage: rows[0].originalImage ? String(rows[0].originalImage) : null };
}
