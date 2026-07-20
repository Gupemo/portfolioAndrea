import styles from "./Sidebar.module.css";
import Link from "next/link";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ open, setOpen }: Props) {
  return (
    <aside
      className={`${styles.sidebar} ${
        open ? styles.open : styles.closed
      }`}
    >
      <button
        className={styles.toggle}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {open && (
        <nav className={styles.nav}> 

          <Link href="/dashboard/">Inicio</Link>
          <Link href="/dashboard/pictures">pictures</Link>
          <Link href="/dashboard/illustrations">illustrations</Link>
          <Link href="/dashboard/contact">Contact</Link>


        </nav>
      )}
    </aside>
  );
}