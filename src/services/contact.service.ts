import { db } from "@/lib/db";
import type { CreateContact } from "@/types/backend";

export async function createContact(data: CreateContact) {
  const { name, email, contactMessage } = data;

  if (
    typeof name !== "string" || typeof email !== "string" || typeof contactMessage !== "string" ||
    !name.trim() || name.length > 250 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 250 ||
    !contactMessage.trim() || contactMessage.length > 5000
  ) {
    throw new Error("MISSING_FIELDS");
  }

  await db.execute(
    `
    INSERT INTO contact (
      name,
      email,
      message
    )
    VALUES (?, ?, ?)
    `,
    [name.trim(), email.trim().toLowerCase(), contactMessage.trim()],
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
      message
    FROM contact
    ORDER BY id DESC
    `,
  );
  return rows
}
