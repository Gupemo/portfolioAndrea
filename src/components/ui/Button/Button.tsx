import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      type="button"
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}