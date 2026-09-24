import { readFile } from "node:fs/promises";
import path from "node:path";

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename: rawFilename } = await params;
  const filename = path.basename(rawFilename);
  if (filename !== rawFilename) return new Response(null, { status: 400 });

  try {
    const uploadDirectory = path.join(process.cwd(), "uploads");
    const data = await readFile(path.join(uploadDirectory, filename));
    return new Response(data, {
      headers: {
        "Content-Type": mimeTypes[path.extname(filename).toLowerCase()] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
