import { getSession } from "@/lib/require-session";
import { createDisplayImage, type WatermarkPosition, type WatermarkType } from "@/lib/watermark";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const types = new Set<WatermarkType>(["none", "text", "signature"]);
const positions = new Set<WatermarkPosition>(["top-left", "top-right", "center", "bottom-left", "bottom-right"]);

export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const form = await request.formData();
    const image = form.get("image");
    const type = String(form.get("watermarkType") ?? "none") as WatermarkType;
    const position = String(form.get("watermarkPosition") ?? "bottom-right") as WatermarkPosition;
    if (!(image instanceof File) || image.size === 0 || image.size > 10 * 1024 * 1024 || !image.type.startsWith("image/")) {
      return Response.json({ error: "INVALID_IMAGE" }, { status: 400 });
    }
    if (!types.has(type) || !positions.has(position)) return Response.json({ error: "INVALID_WATERMARK" }, { status: 400 });

    const watermarkDirectory = path.join(process.cwd(), "uploads", "watermark");
    let signatureBuffer: Buffer | undefined;
    if (type === "signature") {
      const signature = form.get("signature");
      if (signature instanceof File && signature.size > 0) {
        if (signature.type !== "image/png" || signature.size > 3 * 1024 * 1024) {
          return Response.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
        }
        signatureBuffer = Buffer.from(await signature.arrayBuffer());
        await mkdir(watermarkDirectory, { recursive: true });
        await writeFile(path.join(watermarkDirectory, "signature.png"), signatureBuffer);
      } else {
        signatureBuffer = await readFile(path.join(watermarkDirectory, "signature.png")).catch(() => undefined);
      }
      if (!signatureBuffer) return Response.json({ error: "SIGNATURE_REQUIRED" }, { status: 400 });
    }

    const result = await createDisplayImage(Buffer.from(await image.arrayBuffer()), type, position, signatureBuffer);
    return new Response(result, { headers: { "Content-Type": "image/webp", "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "PREVIEW_FAILED" }, { status: 500 });
  }
}
