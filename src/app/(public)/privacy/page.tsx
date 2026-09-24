import Link from "next/link";
import { cookies } from "next/headers";
import { getPrivacyPolicy } from "@/services/privacy.service";
import styles from "./Privacy.module.css";

export default async function PrivacyPage() {
  const locale = (await cookies()).get("locale")?.value === "en" ? "en" : "es";
  const policy = await getPrivacyPolicy(locale);
  return <main className={styles.page}>
    <article className={styles.policy}>
      <Link href="/">← {locale === "es" ? "Volver al inicio" : "Back home"}</Link>
      <div>{policy.content}</div>
      <p className={styles.version}>{locale === "es" ? "Versión" : "Version"}: {policy.version}</p>
    </article>
  </main>;
}
