import type { Locale } from '~/composables/useLocale'
import { CONTACT_PHONE } from '~/constants/contact'

const ERROR_MESSAGES: Record<Locale, string> = {
  ru: `Ошибка. Позвоните нам: ${CONTACT_PHONE}`,
  en: `An error occurred. Please call us: ${CONTACT_PHONE}`,
  kk: `Қате. Бізге қоңырау шалыңыз: ${CONTACT_PHONE}`,
}

export function useQuizForm(locale: Locale = 'ru') {
  const config = useRuntimeConfig()
  const content = useHomeContent(locale)
  const questions = computed(() => content.quiz.questions)
  const questionsTotal = computed(() => questions.value.length)

  const currentStep = ref(0)
  const answers = ref<Record<number, string>>({})
  const showContactForm = ref(false)
  const loading = ref(false)
  const success = ref(false)
  const error = ref<string | null>(null)

  function selectOption(step: number, option: string) {
    answers.value[step] = option
    if (currentStep.value < questions.value.length - 1) {
      currentStep.value++
    } else {
      showContactForm.value = true
    }
  }

  async function submitContact(name: string, phone: string) {
    loading.value = true
    error.value = null
    try {
      const quizAnswers: Record<string, string> = {}
      questions.value.forEach((q, i) => {
        if (answers.value[i]) quizAnswers[q.question] = answers.value[i]
      })

      await $fetch(config.public.apiBase + '/quiz', {
        method: 'POST',
        body: { type: 'quiz', name, phone, quiz_answers: quizAnswers },
      })
      success.value = true
    } catch {
      error.value = ERROR_MESSAGES[locale]
    } finally {
      loading.value = false
    }
  }

  function reset() {
    currentStep.value = 0
    answers.value = {}
    showContactForm.value = false
    loading.value = false
    success.value = false
    error.value = null
  }

  const progress = computed(() => Math.round((currentStep.value / questions.value.length) * 100))

  return {
    currentStep,
    answers,
    showContactForm,
    loading,
    success,
    error,
    progress,
    questions,
    questionsTotal,
    currentQuestion: computed(() => questions.value[currentStep.value]),
    selectOption,
    submitContact,
    reset,
  }
}
