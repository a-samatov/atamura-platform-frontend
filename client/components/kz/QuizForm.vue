<template>
  <div class="quiz">
    <div v-if="quiz.success.value" class="quiz__success" role="alert">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <p class="quiz__success-title">Өтінім жіберілді!</p>
      <p>Менеджер ең жақсы нұсқаны іріктеп, бір сағат ішінде хабарласады.</p>
    </div>

    <template v-else-if="!quiz.showContactForm.value">
      <div class="quiz__header">
        <p class="section-label">Пәтер іріктеу</p>
        <div class="quiz__progress" role="progressbar" :aria-valuenow="quiz.progress.value" aria-valuemin="0" aria-valuemax="100">
          <div class="quiz__progress-bar" :style="{ width: quiz.progress.value + '%' }" />
        </div>
        <span class="quiz__step-count">{{ quiz.currentStep.value + 1 }} / {{ quiz.questionsTotal.value }}</span>
      </div>

      <div class="quiz__question">
        <h2 class="quiz__q-text">{{ quiz.currentQuestion.value.question }}</h2>
        <div class="quiz__options">
          <button
            v-for="option in quiz.currentQuestion.value.opts"
            :key="option"
            class="quiz__option"
            :class="{ selected: quiz.answers.value[quiz.currentStep.value] === option }"
            @click="quiz.selectOption(quiz.currentStep.value, option)"
            type="button"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="quiz__contact">
        <p class="section-label">Соңғы қадам</p>
        <h2 class="quiz__contact-title">Байланыс деректерін қалдырыңыз</h2>
        <p class="quiz__contact-sub">Менеджер ең жақсы нұсқаны таңдап, сізге хабарласады</p>

        <form @submit.prevent="handleContactSubmit" novalidate>
          <div class="app-form__fields">
            <div class="field">
              <label for="quiz-name-kz">Сіздің атыңыз</label>
              <input id="quiz-name-kz" v-model="contactName" type="text" placeholder="Айгүл Ахметова" required autocomplete="given-name" />
            </div>
            <div class="field">
              <label for="quiz-phone-kz">Телефон нөмірі</label>
              <input
  id="quiz-phone-kz"
  :value="contactPhone"
  @input="handlePhoneInput"
  @keydown="handlePhoneKeydown"
  @keypress="handlePhoneKeypress"
  type="tel"
  inputmode="numeric"
  placeholder="+7 (___) ___-__-__"
  autocomplete="tel"
  maxlength="22"
  required
/>
            </div>
          </div>

          <div v-if="quiz.error.value" class="app-form__error" role="alert">{{ quiz.error.value }}</div>

          <AppButton type="submit" size="lg" :loading="quiz.loading.value" style="width: 100%; margin-top: var(--space-6);">
            Іріктеме алу
          </AppButton>

          <p class="app-form__legal">Батырманы басу арқылы сіз <NuxtLink to="/kz/privacy" class="privacy-link" target="_blank">дербес деректерді өңдеу саясатымен</NuxtLink> келісесіз</p>
        </form>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const quiz = useQuizForm('kk')
const contactName = ref('')
const contactPhone = ref('')
const { handlePhoneInput, handlePhoneKeypress, handlePhoneKeydown } = usePhoneMask(contactPhone)

async function handleContactSubmit() {
  if (!contactName.value.trim() || !contactPhone.value.trim()) return
  await quiz.submitContact(contactName.value.trim(), contactPhone.value.trim())
}
</script>

<style scoped>
.quiz { padding: var(--space-8); }
.quiz__header { margin-bottom: var(--space-6); }
.quiz__progress { height: 3px; background-color: var(--color-gray-100); border-radius: 2px; margin-block: var(--space-3); overflow: hidden; }
.quiz__progress-bar { height: 100%; background-color: var(--color-primary); border-radius: 2px; transition: width var(--transition-normal); }
.quiz__step-count { font-size: var(--text-xs); color: var(--color-gray-600); }
.quiz__q-text { font-size: var(--text-xl); font-weight: 600; margin-bottom: var(--space-5); }
.quiz__options { display: flex; flex-direction: column; gap: var(--space-3); }
.quiz__option { padding: var(--space-4); border: 1px solid var(--border-color); border-radius: var(--radius-sm); text-align: left; font-size: var(--text-base); font-weight: 500; color: var(--color-dark); transition: border-color var(--transition-fast), background-color var(--transition-fast); cursor: pointer; background-color: var(--color-white); }
.quiz__option:hover { border-color: var(--color-primary); background-color: var(--color-primary-light); }
.quiz__option.selected { border-color: var(--color-primary); background-color: var(--color-primary); color: var(--color-white); }
.quiz__contact-title { font-size: var(--text-2xl); margin-bottom: var(--space-2); }
.quiz__contact-sub { font-size: var(--text-sm); color: var(--color-gray-600); margin-bottom: var(--space-6); }
.app-form__fields { display: flex; flex-direction: column; gap: var(--space-4); }
.app-form__error { margin-top: var(--space-4); padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm); background-color: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: var(--text-sm); }
.app-form__legal { margin-top: var(--space-4); font-size: var(--text-xs); color: var(--color-gray-600); text-align: center; padding: 0 20px; }
.quiz__success { display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-4); padding-block: var(--space-8); }
.quiz__success-title { font-family: var(--font-heading); font-size: var(--text-xl); font-weight: 600; }
.privacy-link {
  color: var(--color-primary);
}
.privacy-link:hover { opacity: 0.75; }
</style>
