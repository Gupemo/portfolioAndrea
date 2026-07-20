import { db } from "@/lib/db";
import type { CreateContact, Contact } from "@/types/backend";

export async function createContact(data: CreateContact) {
  const { name, email, contactMessage } = data;
  console.log(name, email, contactMessage);

  if (!name || !email || !contactMessage) {
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
    [name, email, contactMessage],
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
