import { deleteContent, getContentForEdit, isContentType, updateContent } from "@/services/content.service";
import { getSession } from "@/lib/require-session";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createDisplayImage, type WatermarkPosition, type WatermarkType } from "@/lib/watermark";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif",
};
const watermarkTypes = new Set<WatermarkType>(["none", "text", "signature"]);
const watermarkPositions = new Set<WatermarkPosition>(["top-left", "top-right", "center", "bottom-left", "bottom-right"]);

async function parseParams(params: Promise<{ type: string; id: string }>) {
  const { type, id: rawId } = await params;
  const id = Number(rawId);
  return { type, id, valid: isContentType(type) && Number.isInteger(id) && id > 0 };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const parsed = await parseParams(params);
  if (!parsed.valid || !isContentType(parsed.type)) return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  const item = await getContentForEdit(parsed.type, parsed.id);
  return item ? Response.json({ ok: true, item }) : Response.json({ error: "NOT_FOUND" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const parsed = await parseParams(params);
  if (!parsed.valid || !isContentType(parsed.type)) return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });

  const current = await getContentForEdit(parsed.type, parsed.id);
  if (!current) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

  try {
    const form = await request.formData();
    const watermarkType = String(form.get("watermarkType") ?? current.watermarkType) as WatermarkType;
    const watermarkPosition = String(form.get("watermarkPosition") ?? current.watermarkPosition) as WatermarkPosition;
    if (!watermarkTypes.has(watermarkType) || !watermarkPositions.has(watermarkPosition)) {
      return Response.json({ error: "INVALID_WATERMARK" }, { status: 400 });
    }
    const translations = {
      es: { title: String(form.get("title_es") ?? "").trim(), description: String(form.get("description_es") ?? "").trim() },
      en: { title: String(form.get("title_en") ?? "").trim(), description: String(form.get("description_en") ?? "").trim() },
    };
    if (Object.values(translations).some((value) => !value.title || !value.description)) {
      return Response.json({ error: "MISSING_TRANSLATIONS" }, { status: 400 });
    }

    const uploadDirectory = path.join(process.cwd(), "uploads");
    const originalDirectory = path.join(uploadDirectory, "originals");
    const watermarkDirectory = path.join(uploadDirectory, "watermark");
    await mkdir(originalDirectory, { recursive: true });
    await mkdir(watermarkDirectory, { recursive: true });

    const suppliedImage = form.get("image");
    const hasNewImage = suppliedImage instanceof File && suppliedImage.size > 0;
    if (hasNewImage && (!extensions[suppliedImage.type] || suppliedImage.size > MAX_IMAGE_SIZE)) {
      return Response.json({ error: "INVALID_IMAGE" }, { status: 400 });
    }

    let signatureBuffer: Buffer | undefined;
    if (watermarkType === "signature") {
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

    const watermarkChanged = watermarkType !== current.watermarkType || watermarkPosition !== current.watermarkPosition;
    let imageUrl = current.image;
    let originalFilename = current.originalImage;
    let oldFiles: { image: string; original: string | null } | null = null;

    if (hasNewImage || watermarkChanged) {
      if (!hasNewImage && !current.originalImage) {
        return Response.json({ error: "ORIGINAL_IMAGE_REQUIRED" }, { status: 409 });
      }
      const originalBuffer = hasNewImage
        ? Buffer.from(await suppliedImage.arrayBuffer())
        : await readFile(path.join(originalDirectory, path.basename(current.originalImage!)));
      const token = randomUUID();
      const newOriginalFilename = hasNewImage ? `${token}.${extensions[suppliedImage.type]}` : current.originalImage!;
      const newFilename = `${token}.webp`;
      const displayImage = await createDisplayImage(originalBuffer, watermarkType, watermarkPosition, signatureBuffer);
      if (hasNewImage) await writeFile(path.join(originalDirectory, newOriginalFilename), originalBuffer);
      await writeFile(path.join(uploadDirectory, newFilename), displayImage);
      imageUrl = `/api/media/${newFilename}`;
      originalFilename = newOriginalFilename;
      oldFiles = {
        image: path.basename(current.image),
        original: hasNewImage && current.originalImage ? path.basename(current.originalImage) : null,
      };
    }

    await updateContent(parsed.type, parsed.id, imageUrl, originalFilename, watermarkType, watermarkPosition, translations);
    if (oldFiles) {
      await unlink(path.join(uploadDirectory, oldFiles.image)).catch(() => undefined);
      if (oldFiles.original) await unlink(path.join(originalDirectory, oldFiles.original)).catch(() => undefined);
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Unable to update portfolio item", error);
    return Response.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { type, id, valid } = await parseParams(params);
  if (!valid || !isContentType(type)) {
    return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const images = await deleteContent(type, id);
  if (!images) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

  const uploadDirectory = path.join(process.cwd(), "uploads");
  await unlink(path.join(uploadDirectory, path.basename(images.image))).catch(() => undefined);
  if (images.originalImage) {
    await unlink(path.join(uploadDirectory, "originals", path.basename(images.originalImage))).catch(() => undefined);
  }
  return Response.json({ ok: true });
}
