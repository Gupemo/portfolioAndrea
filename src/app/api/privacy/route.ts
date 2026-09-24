import { getAllPrivacyPolicies, getPrivacyPolicy, updatePrivacyPolicies } from "@/services/privacy.service";
import { getSession } from "@/lib/require-session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("all") === "true") {
    if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
    return Response.json({ ok: true, policies: await getAllPrivacyPolicies() });
  }
  const locale = url.searchParams.get("locale") === "en" ? "en" : "es";
  return Response.json({ ok: true, policy: await getPrivacyPolicy(locale) });
}

export async function PUT(request: Request) {
  if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const body = await request.json();
    const es = typeof body.es === "string" ? body.es.trim() : "";
    const en = typeof body.en === "string" ? body.en.trim() : "";
    if (!es || !en || es.length > 50000 || en.length > 50000) {
      return Response.json({ error: "INVALID_POLICY" }, { status: 400 });
    }
    const version = await updatePrivacyPolicies(es, en);
    return Response.json({ ok: true, version });
  } catch {
    return Response.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}
