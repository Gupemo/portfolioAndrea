import { db } from "@/lib/db";
import { defaultPrivacyPolicy, PRIVACY_POLICY_VERSION } from "@/lib/default-privacy-policy";
import type { RowDataPacket } from "mysql2";

export type PrivacyLocale = "es" | "en";

export async function getPrivacyPolicy(locale: PrivacyLocale) {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT content, version, updated_at AS updatedAt FROM privacy_policy_translations WHERE locale = ? LIMIT 1",
    [locale],
  );
  return rows[0]
    ? { content: String(rows[0].content), version: String(rows[0].version), updatedAt: rows[0].updatedAt }
    : { content: defaultPrivacyPolicy[locale], version: PRIVACY_POLICY_VERSION, updatedAt: null };
}

export async function getAllPrivacyPolicies() {
  const [es, en] = await Promise.all([getPrivacyPolicy("es"), getPrivacyPolicy("en")]);
  return { es: es.content, en: en.content, version: es.version };
}

export async function updatePrivacyPolicies(es: string, en: string) {
  const version = new Date().toISOString().slice(0, 10);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    for (const [locale, content] of [["es", es], ["en", en]] as const) {
      await connection.execute(
        `INSERT INTO privacy_policy_translations (locale, content, version) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE content = VALUES(content), version = VALUES(version)`,
        [locale, content, version],
      );
    }
    await connection.commit();
    return version;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
