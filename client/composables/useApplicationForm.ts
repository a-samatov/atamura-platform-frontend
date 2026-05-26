import type { ApplicationPayload } from '~/types/api'
import type { Locale } from '~/composables/useLocale'
import { CONTACT_PHONE } from '~/constants/contact'

const ERROR_MESSAGES: Record<Locale, string> = {
  ru: `Произошла ошибка. Пожалуйста, позвоните нам: ${CONTACT_PHONE}`,
  en: `An error occurred. Please call us: ${CONTACT_PHONE}`,
  kk: `Қате орын алды. Бізге қоңырау шалыңыз: ${CONTACT_PHONE}`,
}

export function useApplicationForm(locale: Locale = 'ru') {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const success = ref(false)
  const error = ref<string | null>(null)

  async function submit(payload: ApplicationPayload) {
    loading.value = true
    error.value = null
    try {
      await $fetch(config.public.apiBase + '/applications', {
        method: 'POST',
        body: payload,
      })
      success.value = true
    } catch {
      error.value = ERROR_MESSAGES[locale]
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    success.value = false
    error.value = null
  }

  return { loading, success, error, submit, reset }
}
