"use client";

import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`${styles.dashboard} ${open ? styles.open : styles.closed}`}
    >
      <Sidebar open={open} setOpen={setOpen} />

      <div className={styles.content}>
        <header className={styles.mobileHeader}>
          <button className={styles.menuButton} onClick={() => setOpen(true)}>
            ☰
          </button>
        </header>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
