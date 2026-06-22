"use client"
import { useTranslations } from '@/hooks/useTranslations'

export default function Navbar() {
  const {toggleLanguage} = useTranslations()
  return (
          <button
        onClick={toggleLanguage}
        className=""
        aria-label="Cambiar idioma"
      >
        algo
        </button>
  )
}
