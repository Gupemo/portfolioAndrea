import { createContent, getContent, isContentType } from "@/services/content.service";
import { getSession } from "@/lib/require-session";
import type { Locale } from "@/types/content";
import { mkdir, writeFile } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createDisplayImage, type WatermarkPosition, type WatermarkType } from "@/lib/watermark";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const watermarkTypes = new Set<WatermarkType>(["none", "text", "signature"]);
const watermarkPositions = new Set<WatermarkPosition>(["top-left", "top-right", "center", "bottom-left", "bottom-right"]);

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
    const rawWatermarkType = String(form.get("watermarkType") ?? "none") as WatermarkType;
    const rawWatermarkPosition = String(form.get("watermarkPosition") ?? "bottom-right") as WatermarkPosition;
    if (!watermarkTypes.has(rawWatermarkType) || !watermarkPositions.has(rawWatermarkPosition)) {
      return Response.json({ error: "INVALID_WATERMARK" }, { status: 400 });
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

    const idToken = randomUUID();
    const originalFilename = `${idToken}.${extensions[image.type]}`;
    const filename = `${idToken}.webp`;
    const uploadDirectory = path.join(process.cwd(), "uploads");
    const originalDirectory = path.join(uploadDirectory, "originals");
    const watermarkDirectory = path.join(uploadDirectory, "watermark");
    await mkdir(originalDirectory, { recursive: true });
    await mkdir(watermarkDirectory, { recursive: true });

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    let signatureBuffer: Buffer | undefined;
    if (rawWatermarkType === "signature") {
      const signature = form.get("signature");
      if (signature instanceof File && signature.size > 0) {
        if (signature.type !== "image/png" || signature.size > 3 * 1024 * 1024) {
          return Response.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
        }
        signatureBuffer = Buffer.from(await signature.arrayBuffer());
        await writeFile(path.join(watermarkDirectory, "signature.png"), signatureBuffer);
      } else {
        signatureBuffer = await readFile(path.join(watermarkDirectory, "signature.png")).catch(() => undefined);
      }
      if (!signatureBuffer) return Response.json({ error: "SIGNATURE_REQUIRED" }, { status: 400 });
    }

    const displayImage = await createDisplayImage(imageBuffer, rawWatermarkType, rawWatermarkPosition, signatureBuffer);
    await writeFile(path.join(originalDirectory, originalFilename), imageBuffer);
    await writeFile(path.join(uploadDirectory, filename), displayImage);
    const imageUrl = `/api/media/${filename}`;

    const id = await createContent(
      type,
      imageUrl,
      originalFilename,
      rawWatermarkType,
      rawWatermarkPosition,
      translations,
    );
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("Unable to create portfolio item", error);
    const detail = error instanceof Error ? error.message : String(error);
    return Response.json({ error: "CREATE_FAILED", detail }, { status: 500 });
  }
}
