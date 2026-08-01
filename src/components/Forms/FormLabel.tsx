import styles from './Form.module.css'


import { LabelHTMLAttributes } from "react";

type Props = LabelHTMLAttributes<HTMLLabelElement>

export default function FormLabel(props: Props){
  return(
    <label className={styles.formLabel}>{props.children}</label>
  )
}