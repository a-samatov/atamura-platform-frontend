<template>
  <section class="section section--dark quiz-section" aria-labelledby="quiz-heading">
    <div class="container quiz-inner">
      <div class="quiz-header reveal-left">
        <p class="section-label">{{ content.label }}</p>
        <h2 id="quiz-heading" class="quiz-title">{{ content.heading }}</h2>
        <p class="quiz-desc">{{ content.desc }}</p>
        <div
          class="quiz-progress-wrap"
          role="progressbar"
          :aria-valuenow="quizProgressPct"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="quiz-progress-bar" :style="{ width: quizProgressPct + '%' }" />
        </div>
        <p class="quiz-step-info">
          {{ quizSubmitted
              ? content.submittedText
              : quizDone
                ? content.lastStepText
                : `${content.stepPrefix} ${quizStep} ${content.stepOf} ${content.questions.length}` }}
        </p>
      </div>

      <div class="quiz-widget reveal-right">
        <Transition name="quiz-slide" mode="out-in">
          <div v-if="!quizSubmitted" :key="quizDone ? 'form' : quizStep" class="quiz-panel" :data-quiz-step="quizDone ? 'form' : quizStep">

            <template v-if="!quizDone">
              <p class="quiz-panel__q">{{ content.questions[quizStep - 1].question }}</p>
              <div class="quiz-panel__opts" role="group" :aria-label="content.questions[quizStep - 1].question">
                <button
                  v-for="opt in content.questions[quizStep - 1].opts"
                  :key="opt"
                  class="quiz-panel__opt"
                  :class="{ 'quiz-panel__opt--selected': quizAnswers[quizStep - 1] === opt }"
                  @click="selectAnswer(opt)"
                >
                  <span class="quiz-panel__opt-check" aria-hidden="true" />
                  {{ opt }}
                </button>
              </div>
              <button v-if="quizStep > 1" class="quiz-back-btn" @click="quizStep--">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                {{ content.backBtn }}
              </button>
            </template>

            <template v-else>
              <p class="quiz-panel__q">{{ content.contactPrompt }}</p>
              <div class="quiz-form">
                <div class="field">
                  <label for="quiz-name">{{ content.nameLabel }}</label>
                  <input id="quiz-name" v-model="quizName" :placeholder="content.namePlaceholder" autocomplete="given-name" />
                </div>
                <div class="field">
                  <label for="quiz-phone">{{ content.phoneLabel }} <span style="color: var(--color-accent)">*</span></label>
                  <input
                    id="quiz-phone"
                    :value="quizPhone"
                    @input="handlePhoneInput"
                    @keydown="handlePhoneKeydown"
                    @keypress="handlePhoneKeypress"
                    placeholder="+7 (___) ___-__-__"
                    type="tel"
                    inputmode="numeric"
                    autocomplete="tel"
                    maxlength="22"
                    :class="{ error: quizPhoneError }"
                  />
                  <span v-if="quizPhoneError" class="quiz-field-error">{{ content.phoneError }}</span>
                </div>
                <div class="quiz-form-footer">
                  <AppButton @click="submitQuiz" :disabled="quizLoading">
                    {{ quizLoading ? content.submittingBtn : content.submitBtn }}
                  </AppButton>
                  <button class="quiz-back-btn" @click="quizDone = false; quizStep = content.questions.length">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    {{ content.backBtn }}
                  </button>
                </div>
              </div>
            </template>
          </div>

          <div v-else key="thanks" class="quiz-thanks">
            <div class="quiz-thanks__check" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 class="quiz-thanks__title">{{ content.thankTitle }}</h3>
            <p class="quiz-thanks__desc">{{ content.thankDesc }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { QuizContent } from '~/composables/useHomeContent'

const props = defineProps<{ content: QuizContent }>()

const quizStep      = ref(1)
const quizAnswers   = ref<string[]>([])
const quizDone      = ref(false)
const quizSubmitted = ref(false)
const quizName      = ref('')
const quizPhone     = ref('')
const { handlePhoneInput, handlePhoneKeypress, handlePhoneKeydown } = usePhoneMask(quizPhone)
const quizPhoneError = ref(false)
const quizLoading    = ref(false)

const quizProgressPct = computed(() => {
  if (quizSubmitted.value || quizDone.value) return 100
  return Math.round(((quizStep.value - 1) / props.content.questions.length) * 100)
})

function selectAnswer(opt: string) {
  quizAnswers.value[quizStep.value - 1] = opt
  if (quizStep.value < props.content.questions.length) quizStep.value++
  else quizDone.value = true
}

const apiBase = useApiBase()

async function submitQuiz() {
  quizPhoneError.value = !quizPhone.value.trim()
  if (quizPhoneError.value) return
  quizLoading.value = true
  try {
    await $fetch(`${apiBase}/applications`, {
      method: 'POST',
      body: {
        name: quizName.value || props.content.defaultName,
        phone: quizPhone.value,
        jk_slug: 'atmosfera',
        message: quizAnswers.value.map((a, i) => `${props.content.questions[i].question}: ${a}`).join('\n'),
        source: 'quiz',
      },
    })
  } catch {
    // silent — don't block UX on network errors
  } finally {
    quizSubmitted.value = true
    quizLoading.value = false
  }
}
</script>

<style scoped>
.quiz-section { padding-block: var(--space-24); }

.quiz-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
  min-height: 385px;
}

.quiz-title {
  font-size: clamp(var(--text-2xl), 3vw, var(--text-4xl));
  font-weight: 600;
  line-height: var(--leading-tight);
  color: var(--color-white);
  margin-top: var(--space-2);
  margin-bottom: var(--space-4);
}

.quiz-desc { font-size: var(--text-base); color: rgba(255, 255, 255, 0.55); line-height: var(--leading-relaxed); margin-bottom: var(--space-8); }

.quiz-progress-wrap { height: 2px; background: rgba(255, 255, 255, 0.12); border-radius: 1px; overflow: hidden; margin-bottom: var(--space-3); }
.quiz-progress-bar  { height: 100%; background: var(--color-accent); border-radius: 1px; transition: width 0.45s ease; }

.quiz-step-info { font-size: 0.9rem; color: rgba(255, 255, 255, 0.38); font-family: var(--font-heading); letter-spacing: 0.05em; }

.quiz-widget {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.quiz-panel { display: flex; flex-direction: column; gap: var(--space-5); }

.quiz-panel__q { font-size: var(--text-lg); font-weight: 600; color: var(--color-white); line-height: var(--leading-tight); }

.quiz-panel__opts { display: flex; flex-direction: column; gap: var(--space-2); }

.quiz-panel__opt {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-align: left;
  padding: var(--space-3) var(--space-4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast), color var(--transition-fast);
}
.quiz-panel__opt:hover         { border-color: rgba(255, 255, 255, 0.35); background: rgba(255, 255, 255, 0.08); color: var(--color-white); }
.quiz-panel__opt--selected     { border-color: var(--color-accent); background: rgba(58, 166, 185, 0.12); color: var(--color-white); }

.quiz-panel__opt-check {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  transition: border-color var(--transition-fast), background var(--transition-fast);
}
.quiz-panel__opt--selected .quiz-panel__opt-check { border-color: var(--color-accent); background: var(--color-accent); }

.quiz-back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.38);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color var(--transition-fast);
  margin-top: var(--space-1);
}
.quiz-back-btn:hover { color: rgba(255, 255, 255, 0.8); }

.quiz-form { display: flex; flex-direction: column; gap: var(--space-4); }

.quiz-form :deep(.field label),
.quiz-form .field label { color: rgba(255, 255, 255, 0.55); }

.quiz-form :deep(.field input),
.quiz-form .field input { background: rgba(255, 255, 255, 0.07); border-color: rgba(255, 255, 255, 0.15); color: var(--color-white); }

.quiz-form :deep(.field input)::placeholder,
.quiz-form .field input::placeholder { color: rgba(255, 255, 255, 0.25); }

.quiz-form :deep(.field input:focus),
.quiz-form .field input:focus { border-color: var(--color-accent); }

.quiz-field-error { font-size: var(--text-xs); color: #f87171; }

.quiz-form-footer { display: flex; align-items: center; gap: var(--space-5); flex-wrap: wrap; }

.quiz-slide-enter-active,
.quiz-slide-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.quiz-slide-enter-from { opacity: 0; transform: translateX(24px); }
.quiz-slide-leave-to   { opacity: 0; transform: translateX(-24px); }

.quiz-thanks { text-align: center; padding: var(--space-8) 0; display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }

.quiz-thanks__check { width: 56px; height: 56px; background: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }
.quiz-thanks__title { font-size: var(--text-xl); font-weight: 600; color: var(--color-white); }
.quiz-thanks__desc  { font-size: var(--text-sm); color: rgba(255, 255, 255, 0.55); line-height: var(--leading-relaxed); max-width: 280px; }

@media (max-width: 1024px) { .quiz-inner { grid-template-columns: 1fr; } }
</style>
