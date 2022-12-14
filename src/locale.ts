import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import en from './locales/en.json'

const resources = {
  en: {
    translation: en,
  },
}

export const DefaultLanguage = 'en'

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: DefaultLanguage,
    lng: DefaultLanguage,
    debug: true,
    resources,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
