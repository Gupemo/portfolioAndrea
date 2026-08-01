import styles from './Form.module.css'


import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>

export default function FormSubmit(props: Props){
  return(
    <input
      {...props}
      className={styles.formSubmit}
      type="submit"
    />

  )
}