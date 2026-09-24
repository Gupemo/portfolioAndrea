import { db } from "@/lib/db";
import type { CreateContact } from "@/types/backend";
import { getPrivacyPolicy } from "@/services/privacy.service";

export async function createContact(data: CreateContact) {
  const { name, email, contactMessage, privacyAccepted } = data;

  if (
    typeof name !== "string" || typeof email !== "string" || typeof contactMessage !== "string" ||
    !name.trim() || name.length > 250 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 250 ||
    !contactMessage.trim() || contactMessage.length > 5000 || privacyAccepted !== true
  ) {
    throw new Error("MISSING_FIELDS");
  }

  const policy = await getPrivacyPolicy("es");
  await db.execute(
    `
    INSERT INTO contact (
      name,
      email,
      message,
      privacy_accepted_at,
      privacy_version
    )
    VALUES (?, ?, ?, NOW(), ?)
    `,
    [name.trim(), email.trim().toLowerCase(), contactMessage.trim(), policy.version],
  );

  return { ok: true };
}

export async function getContacts() {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      name,
      email,
      message,
      privacy_accepted_at AS privacyAcceptedAt,
      privacy_version AS privacyVersion
    FROM contact
    ORDER BY id DESC
    `,
  );
  return rows
}
