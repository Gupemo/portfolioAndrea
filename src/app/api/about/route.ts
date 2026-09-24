import { getAbout, getAllAbout, updateAbout } from "@/services/about.service";
import { getSession } from "@/lib/require-session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("all") === "true") {
    if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
    return Response.json({ ok: true, translations: await getAllAbout() });
  }
  const locale = url.searchParams.get("locale") === "en" ? "en" : "es";
  return Response.json({ ok: true, content: await getAbout(locale) });
}

export async function PUT(request: Request) {
  if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const body = await request.json();
    const es = typeof body.es === "string" ? body.es.trim() : "";
    const en = typeof body.en === "string" ? body.en.trim() : "";
    if (!es || !en || es.length > 10000 || en.length > 10000) {
      return Response.json({ error: "INVALID_CONTENT" }, { status: 400 });
    }
    await updateAbout({ es, en });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}
