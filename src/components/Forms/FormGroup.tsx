import { HTMLAttributes } from "react";
import styles from './Form.module.css'

type Props = HTMLAttributes<HTMLDivElement>;

export default function FormGroup(props: Props) {
  return (
    <div className={styles.formGroup}>
      {props.children}
    </div>
  );
}