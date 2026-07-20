import { createContact, getContacts } from "@/services/contact.service"

export async function POST (req: Request){
  const body = await req.json()
  const result = await createContact(body)
  return Response.json(result)
}

export async function GET (){
  const result = await getContacts()

  return Response.json({
    ok: true,
    contact: result
  })

}