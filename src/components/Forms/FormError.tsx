import styles from './Form.module.css'


export default function FormError({children}: {children: React.ReactNode}) {
  return(
    <p className={styles.formError}>{children}</p>
  )
}