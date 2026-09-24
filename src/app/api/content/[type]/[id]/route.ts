import { deleteContent, isContentType } from "@/services/content.service";
import { getSession } from "@/lib/require-session";
import { unlink } from "node:fs/promises";
import path from "node:path";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { type, id: rawId } = await params;
  const id = Number(rawId);
  if (!isContentType(type) || !Number.isInteger(id) || id < 1) {
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
