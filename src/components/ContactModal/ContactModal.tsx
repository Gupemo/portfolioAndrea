
import { useTranslations } from '@/hooks/useTranslations'
import styles from './ContactModal.module.css'
import {useForm} from 'react-hook-form'
import type { ContactType } from '@/types/frontend'
import Button from '../ui/Button/Button'

type Props = {
  onClose: () => void
}

export default function ContactModal({onClose}: Props) {
  const {translate} = useTranslations()
  const {register, handleSubmit, reset, formState: {errors} } = useForm<ContactType>({mode: "onSubmit"})

  const onSubmit = () =>{

  }
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <form className={styles.form}>
          <div className={styles.camp}>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              {...register("name")}
            />
          </div>
          <div className={styles.camp}>
            <label htmlFor="email">email</label>
            <input 
              type="email"
              id="email" 
              {...register("email")}
            />
          </div>
          <div className={styles.camp}>
          <label htmlFor="contactMessage">Mensaje de contacto</label>
          <textarea 
            id="contactMessage"
            {...register("contactMessage")}
          ></textarea>

          </div>
          <div className={styles.buttons}>
            <Button variant='primary'>Enviar</Button>
            <Button 
              type='button'
              variant='secondary'
              onClick={() => reset()}
            >Resetear</Button>

          </div>

        </form>

      </div>

    </div>
  )
}
