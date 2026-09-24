import { RowDataPacket } from "mysql2"

export type CreateContact = {
  id?: number,
  name: string,
  email: string,
  contactMessage: string,
  privacyAccepted: boolean
}

export type Contact = RowDataPacket & {
  id: number,
  name: string,
  email: string,
  message: string,
  privacyAcceptedAt: string | null,
  privacyVersion: string | null

}
