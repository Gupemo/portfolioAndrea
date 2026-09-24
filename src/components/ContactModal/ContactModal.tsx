"use client"
import { useTranslations } from '@/hooks/useTranslations'
import {toast} from 'react-toastify'
import styles from './ContactModal.module.css'
import {SubmitHandler, useForm} from 'react-hook-form'
import type { ContactType } from '@/types/frontend'
import Button from '../ui/Button/Button'
import Link from "next/link";

type Props = {
  onClose: () => void
}

export default function ContactModal({onClose}: Props) {
  const {translate} = useTranslations()
  const {register, handleSubmit, reset, formState: {errors} } = useForm<ContactType>({mode: "onChange"})

  const onSubmit: SubmitHandler<ContactType> = async (data) =>{
    try{
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      if(!response.ok){
        throw new Error(result.error || "Error")
      }
      toast.success(translate.contactModal.toasts.success)
      reset()
    }
    catch{
      toast.error(translate.contactModal.toasts.error)
    }

  }
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <h1>{translate.contactModal.title}</h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.camp}>
            <label htmlFor="name">{translate.contactModal.name}</label>
            <input
              type="text"
              id="name"
              placeholder={translate.contactModal.placeHolders.name}
              {...register("name", {
                required: translate.contactModal.errors.name
              })}
            />
          </div>
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}

          <div className={styles.camp}>
            <label htmlFor="email">{translate.contactModal.email}</label>
            <input 
              type="email"
              id="email"
              placeholder={translate.contactModal.placeHolders.email}
              {...register("email", {
                required: translate.contactModal.errors.email,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: translate.contactModal.errors.wrongMail
                }
              })}
            />
          </div>
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          <div className={styles.camp}>
          <label htmlFor="contactMessage">{translate.contactModal.text}</label>
          <textarea 
            id="contactMessage"
            placeholder={translate.contactModal.placeHolders.text}
            {...register("contactMessage", {
              required: translate.contactModal.errors.text
            })}
          ></textarea>

          </div>
          {errors.contactMessage && <span className={styles.error}>{errors.contactMessage.message}</span>}

          <div className={styles.privacySummary}>
            <p><strong>{translate.contactModal.privacy.controllerLabel}:</strong> Guiomar Pérez Montesdeoca</p>
            <p><strong>{translate.contactModal.privacy.purposeLabel}:</strong> {translate.contactModal.privacy.purpose}</p>
            <p><strong>{translate.contactModal.privacy.legalBasisLabel}:</strong> {translate.contactModal.privacy.legalBasis}</p>
            <p><strong>{translate.contactModal.privacy.rightsLabel}:</strong> {translate.contactModal.privacy.rights}</p>
          </div>

          <label className={styles.consent}>
            <input type="checkbox" {...register("privacyAccepted", { required: translate.contactModal.errors.privacy })} />
            <span>{translate.contactModal.privacy.accept} <Link href="/privacy" target="_blank">{translate.contactModal.privacy.link}</Link>.</span>
          </label>
          {errors.privacyAccepted && <span className={styles.error}>{errors.privacyAccepted.message}</span>}

          <div className={styles.buttons}>
            <Button
              variant='primary'
              type='submit'
            >{translate.contactModal.submit}</Button>
            <Button 
              variant='secondary'
              onClick={() => reset()}
            >{translate.contactModal.reset}</Button>

          </div>

        </form>

      </div>

    </div>
  )
}
