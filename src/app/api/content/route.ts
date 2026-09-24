import { createContent, getContent, isContentType } from "@/services/content.service";
import { getSession } from "@/lib/require-session";
import type { Locale } from "@/types/content";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? "illustration";
  const locale: Locale = url.searchParams.get("locale") === "en" ? "en" : "es";
  if (!isContentType(type)) return Response.json({ error: "INVALID_TYPE" }, { status: 400 });

  return Response.json({ ok: true, items: await getContent(type, locale) });
}

export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });

  try {
    const form = await request.formData();
    const type = String(form.get("type") ?? "");
    const image = form.get("image");
    if (!isContentType(type) || !(image instanceof File)) {
      return Response.json({ error: "INVALID_FORM" }, { status: 400 });
    }
    if (!extensions[image.type] || image.size === 0 || image.size > MAX_IMAGE_SIZE) {
      return Response.json({ error: "INVALID_IMAGE" }, { status: 400 });
    }

    const translations = {
      es: {
        title: String(form.get("title_es") ?? "").trim(),
        description: String(form.get("description_es") ?? "").trim(),
      },
      en: {
        title: String(form.get("title_en") ?? "").trim(),
        description: String(form.get("description_en") ?? "").trim(),
      },
    };
    if (Object.values(translations).some((value) => !value.title || !value.description)) {
      return Response.json({ error: "MISSING_TRANSLATIONS" }, { status: 400 });
    }

    const filename = `${randomUUID()}.${extensions[image.type]}`;
    const uploadDirectory = path.join(process.cwd(), "uploads");
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, filename), Buffer.from(await image.arrayBuffer()));
    const imageUrl = `/api/media/${filename}`;

    const id = await createContent(type, imageUrl, translations);
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("Unable to create portfolio item", error);
    return Response.json({ error: "CREATE_FAILED" }, { status: 500 });
  }
}
