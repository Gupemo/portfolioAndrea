"use client";

import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./ContactList.module.css";

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  privacyAcceptedAt: string | null;
  privacyVersion: string | null;
};

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openContact, setOpenContact] = useState<number | null>(null);

  useEffect(() => {
    async function getContacts() {
      const res = await fetch("/api/contact");

      if (!res.ok) {
        toast.error("Error al obtener los contactos");
        return;
      }

      const data = await res.json();
      setContacts(data.contact);
    }

    getContacts();
  }, []);

  function toggleContact(id: number) {
    setOpenContact((prev) => (prev === id ? null : id));
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.contactTable}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Mensaje</th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((contact) => (
            <Fragment key={contact.id}>
              <tr
                className={styles.row}
                onClick={() => toggleContact(contact.id)}
              >
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{openContact === contact.id ? "▲" : "▼"}</td>
              </tr>

              {openContact === contact.id && (
                <tr className={styles.detailsRow}>
                  <td colSpan={3}>
                    <div className={styles.message}>
                      <p>{contact.message}</p>
                      {contact.privacyAcceptedAt && <small>
                        Privacidad aceptada: {new Date(contact.privacyAcceptedAt).toLocaleString("es-ES")} · versión {contact.privacyVersion}
                      </small>}
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
