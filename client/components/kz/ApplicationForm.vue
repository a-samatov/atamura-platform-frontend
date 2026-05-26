<template>
  <div class="app-form">
    <div class="app-form__header">
      <h2 class="app-form__title">Өтінім қалдыру</h2>
      <p class="app-form__subtitle">Менеджер бір сағат ішінде хабарласады</p>
    </div>

    <div v-if="form.success.value" class="app-form__success" role="alert">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <p class="app-form__success-title">Өтінім жіберілді!</p>
      <p>Менеджеріміз бір сағат ішінде хабарласады.</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" novalidate>
      <div class="app-form__fields">
        <div class="field">
          <label for="app-name-kz">Сіздің атыңыз</label>
          <input
            id="app-name-kz"
            v-model="name"
            type="text"
            placeholder="Айгүл Ахметова"
            :class="{ error: nameError }"
            autocomplete="given-name"
            required
          />
          <span v-if="nameError" class="field-error">{{ nameError }}</span>
        </div>

        <div class="field">
          <label for="app-phone-kz">Телефон нөмірі</label>
          <input
  id="app-phone-kz"
  :value="phone"
  @input="handlePhoneInput"
  @keydown="handlePhoneKeydown"
  @keypress="handlePhoneKeypress"
  type="tel"
  inputmode="numeric"
  placeholder="+7 (___) ___-__-__"
  autocomplete="tel"
  maxlength="22"
  :class="{ error: phoneError }"
/>
          <span v-if="phoneError" class="field-error">{{ phoneError }}</span>
        </div>

        <div v-if="props.jkSlug !== undefined" class="field">
          <label for="app-jk-kz">Тұрғын үй кешені</label>
          <select id="app-jk-kz" v-model="selectedJk">
            <option value="">— ТҮК таңдаңыз —</option>
            <option v-for="jk in jkOptions" :key="jk.slug" :value="jk.slug">{{ jk.label }}</option>
          </select>
        </div>

        <div v-if="bank" class="field">
          <label>Серіктес банк</label>
          <div class="field-badge">{{ bank }}</div>
        </div>
      </div>

      <div v-if="form.error.value" class="app-form__error" role="alert">
        {{ form.error.value }}
      </div>

      <AppButton
        type="submit"
        size="lg"
        :loading="form.loading.value"
        style="width: 100%; margin-top: var(--space-6);"
      >
        Өтінім жіберу
      </AppButton>

      <p class="app-form__legal">Батырманы басу арқылы сіз <NuxtLink to="/kz/privacy" class="privacy-link" target="_blank">дербес деректерді өңдеу саясатымен</NuxtLink> келісесіз</p>
    </form>
  </div>
</template>

<script setup lang="ts">
const PHONE_ERRORS: Record<string, string> = {
  phone_required: 'Телефонды енгізіңіз',
  phone_too_short: 'Кемінде 7 сан',
  phone_too_long: 'Қате нөмір',
}

const props = defineProps<{
  jkSlug?: string
  planName?: string
  bank?: string
}>()

const form = useApplicationForm('kk')
const route = useRoute()
const name = ref('')
const phone = ref('')
const nameError = ref('')
const phoneError = ref('')
const selectedJk = ref(props.jkSlug || '')

const jkOptions = [
  { slug: 'atmosfera', label: 'ЖК Атмосфера' },
]

const source = computed(() => route.path)
const { handlePhoneInput, handlePhoneKeypress, handlePhoneKeydown, validatePhone } = usePhoneMask(phone)

function validate(): boolean {
  let valid = true
  nameError.value = ''
  phoneError.value = ''
  if (!name.value.trim() || name.value.trim().length < 2) {
    nameError.value = 'Атыңызды енгізіңіз (кемінде 2 таңба)'
    valid = false
  }
  const phoneCode = validatePhone()
  if (phoneCode) {
    phoneError.value = PHONE_ERRORS[phoneCode] ?? phoneCode
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  await form.submit({
    type: 'flat',
    jk_slug: selectedJk.value || undefined,
    plan_name: props.planName,
    name: name.value.trim(),
    phone: phone.value.trim(),
    lang: 'kk',
    source: source.value,
    bank: props.bank,
  })
}
</script>

<style scoped>
.app-form { padding: var(--space-8); }
.app-form__header { margin-bottom: var(--space-6); }
.app-form__title { font-size: var(--text-2xl); margin-bottom: var(--space-2); }
.app-form__subtitle { font-size: var(--text-sm); color: var(--color-gray-600); }
.app-form__fields { display: flex; flex-direction: column; gap: var(--space-4); }
.field-badge { display: flex; align-items: center; gap: var(--space-2); padding: 10px var(--space-4); background-color: var(--color-primary-light); color: var(--color-primary); border-radius: var(--radius-sm); font-size: var(--text-sm); font-weight: 600; border: 1px solid var(--color-primary); opacity: 0.9; }
.field-error { font-size: var(--text-xs); color: #dc2626; }
.app-form__error { margin-top: var(--space-4); padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm); background-color: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: var(--text-sm); }
.app-form__legal { margin-top: var(--space-4); font-size: var(--text-xs); color: var(--color-gray-600); text-align: center; line-height: var(--leading-relaxed); padding: 0 20px;}
.app-form__success { display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-4); padding-block: var(--space-8); }
.app-form__success-title { font-family: var(--font-heading); font-size: var(--text-xl); font-weight: 600; }
.privacy-link {
  color: var(--color-primary);
}
.privacy-link:hover { opacity: 0.75; }
</style>
