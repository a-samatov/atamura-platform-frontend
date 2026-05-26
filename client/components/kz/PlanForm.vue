<template>
  <div class="app-form">
    <div class="app-form__header">
      <h2 class="app-form__title">Жоспарды таңдау</h2>
      <p v-if="planName" class="app-form__subtitle">{{ planName }}</p>
    </div>

    <div v-if="form.success.value" class="app-form__success" role="alert">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <p class="app-form__success-title">Өтінім қабылданды!</p>
      <p>Менеджер бір сағат ішінде хабарласып, таңдалған жоспар туралы толығырақ айтады.</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" novalidate>
      <div class="app-form__fields">
        <div class="field">
          <label for="plan-name-kz">Сіздің атыңыз</label>
          <input id="plan-name-kz" v-model="name" type="text" placeholder="Айгүл Ахметова" required autocomplete="given-name" />
        </div>
        <div class="field">
          <label for="plan-phone-kz">Телефон нөмірі</label>
          <input
  id="plan-phone-kz"
  :value="phone"
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
        <div v-if="planName" class="field">
          <label>Жоспар</label>
          <input :value="planName" type="text" readonly class="field__readonly" />
        </div>
      </div>

      <div v-if="form.error.value" class="app-form__error" role="alert">{{ form.error.value }}</div>

      <AppButton type="submit" size="lg" :loading="form.loading.value" style="width: 100%; margin-top: var(--space-6);">
        Өтінім жіберу
      </AppButton>

      <p class="app-form__legal">Батырманы басу арқылы сіз <NuxtLink to="/kz/privacy" class="privacy-link" target="_blank">дербес деректерді өңдеу саясатымен</NuxtLink> келісесіз</p>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ planName?: string; jkSlug?: string }>()
const form = useApplicationForm()
const name = ref('')
const phone = ref('')
const { handlePhoneInput, handlePhoneKeypress, handlePhoneKeydown } = usePhoneMask(phone) // добавить

async function handleSubmit() {
  if (!name.value.trim() || !phone.value.trim()) return
  await form.submit({
    type: 'flat',
    jk_slug: props.jkSlug,
    plan_name: props.planName,
    name: name.value.trim(),
    phone: phone.value.trim(),
  })
}
</script>

<style scoped>
.app-form { padding: var(--space-8); }
.app-form__header { margin-bottom: var(--space-6); }
.app-form__title { font-size: var(--text-2xl); margin-bottom: var(--space-2); }
.app-form__subtitle { font-size: var(--text-sm); color: var(--color-gray-600); }
.app-form__fields { display: flex; flex-direction: column; gap: var(--space-4); }
.field__readonly { background-color: var(--color-gray-100); color: var(--color-gray-600); cursor: default; }
.app-form__error { margin-top: var(--space-4); padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm); background-color: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: var(--text-sm); }
.app-form__legal { margin-top: var(--space-4); font-size: var(--text-xs); color: var(--color-gray-600); text-align: center; padding: 0 20px; }
.app-form__success { display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-4); padding-block: var(--space-8); }
.app-form__success-title { font-family: var(--font-heading); font-size: var(--text-xl); font-weight: 600; }
.privacy-link {
  color: var(--color-primary);
}
.privacy-link:hover { opacity: 0.75; }
</style>
