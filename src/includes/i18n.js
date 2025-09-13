import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json' assert { type: 'json' }
import fr from '@/locales/fr.json' assert { type: 'json' }
import ar from '@/locales/ar.json' assert { type: 'json' }
import { create } from 'lodash'

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    ar,
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
      },
    },
    ar: {
      currency: {
        style: 'currency',
        currency: 'EGP',
      },
    },
    fr: {
      currency: {
        style: 'currency',
        currency: 'EUR',
      },
    },
  },
})
