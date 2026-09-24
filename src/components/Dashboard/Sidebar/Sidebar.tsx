import styles from "./Sidebar.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ open, setOpen }: Props) {
  const router = useRouter();
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setOpen(false);
    }
  };

  async function signOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}

      <aside
        className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}
      >
        <button className={styles.toggle} onClick={() => setOpen(!open)}>
          ☰
        </button>

        {open && (
          <nav className={styles.nav}>
            <Link href="/dashboard/" onClick={handleLinkClick}>
              Inicio
            </Link>

            <Link href="/dashboard/pictures" onClick={handleLinkClick}>
              Pictures
            </Link>

            <Link href="/dashboard/illustrations" onClick={handleLinkClick}>
              Illustrations
            </Link>

            <Link href="/dashboard/contact" onClick={handleLinkClick}>
              Mensajes
            </Link>
            <button className={styles.signOut} onClick={signOut}>Cerrar sesión</button>
          </nav>
        )}
      </aside>
    </>
  );
}
