import { createContact, getContacts } from "@/services/contact.service"
import { getSession } from "@/lib/require-session";

export async function POST (req: Request){
  try {
    const body = await req.json()
    const result = await createContact(body)
    return Response.json(result, { status: 201 })
  } catch {
    return Response.json({ error: "INVALID_CONTACT" }, { status: 400 });
  }
}

export async function GET (){
  if (!(await getSession())) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const result = await getContacts()

  return Response.json({
    ok: true,
    contact: result
  })

}
