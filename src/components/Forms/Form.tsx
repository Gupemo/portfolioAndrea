import { FormHTMLAttributes } from "react";
import styles from './Form.module.css'

type Props = FormHTMLAttributes<HTMLFormElement>

export default function Form(props: Props){
  return(
    <form className={styles.form} {...props}>
      {props.children}
    </form>
  )
}