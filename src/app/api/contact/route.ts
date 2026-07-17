import { createContact } from "@/services/contact.service"

export async function POST (req: Request){
    console.log("Entró al endpoint");

  const body = await req.json()
  console.log(body)
  const result = await createContact(body)
  return Response.json(result)
}