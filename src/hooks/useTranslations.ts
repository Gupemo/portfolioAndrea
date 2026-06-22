import { useContext } from "react"
import { TranslationsContext } from "@/context/TranslationsContext"

export function useTranslations() {
  const context = useContext(TranslationsContext)
  if (!context) {
    throw new Error("useTranslations must be used inside TranslationsProvider")
  }
  return context
}