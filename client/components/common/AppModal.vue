<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="uiStore.isModalOpen" class="modal-overlay" @click.self="uiStore.closeModal()">
        <div class="modal" role="dialog" :aria-label="modalTitle" aria-modal="true">
          <button class="modal__close" @click="uiStore.closeModal()" aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <component
            :is="currentForm"
            :jk-slug="(uiStore.modalData.jkSlug as string) || undefined"
            :plan-name="(uiStore.modalData.planName as string) || undefined"
            :bank="(uiStore.modalData.bank as string) || undefined"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const uiStore = useUiStore()
const locale = useLocale()

// resolveComponent must be called at setup() level, not inside computed()
const AppFormRu  = resolveComponent('FormsApplicationForm')
const QuizFormRu = resolveComponent('FormsQuizForm')
const PlanFormRu = resolveComponent('FormsPlanForm')
const AppFormKk  = resolveComponent('KzApplicationForm')
const QuizFormKk = resolveComponent('KzQuizForm')
const PlanFormKk = resolveComponent('KzPlanForm')
const AppFormEn  = resolveComponent('EnApplicationForm')
const QuizFormEn = resolveComponent('EnQuizForm')
const PlanFormEn = resolveComponent('EnPlanForm')

const currentForm = computed(() => {
  const type = uiStore.modalType
  if (locale.value === 'kk') {
    return type === 'quiz' ? QuizFormKk : type === 'plan' ? PlanFormKk : AppFormKk
  }
  if (locale.value === 'en') {
    return type === 'quiz' ? QuizFormEn : type === 'plan' ? PlanFormEn : AppFormEn
  }
  return type === 'quiz' ? QuizFormRu : type === 'plan' ? PlanFormRu : AppFormRu
})

const modalTitle = computed(() => {
  const titles: Record<string, Record<string, string>> = {
    ru: { quiz: 'Подбор квартиры', plan: 'Оставить заявку на планировку', application: 'Оставить заявку' },
    kk: { quiz: 'Пәтер іріктеу', plan: 'Жоспарға өтінім', application: 'Өтінім қалдыру' },
    en: { quiz: 'Apartment Selection', plan: 'Floor Plan Request', application: 'Leave a Request' },
  }
  const l = locale.value === 'kk' ? 'kk' : locale.value === 'en' ? 'en' : 'ru'
  return titles[l][uiStore.modalType || 'application'] || 'Request'
})

const handleKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') uiStore.closeModal()
}
onMounted(() => {
  window.addEventListener('keydown', handleKey)
  watchEffect(() => {
    document.documentElement.classList.toggle('has-modal', uiStore.isModalOpen)
  })
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  document.documentElement.classList.remove('has-modal')
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 28, 30, 0.6);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  backdrop-filter: blur(2px);
}

.modal {
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
}

.modal__close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  color: var(--color-gray-600);
  transition: color var(--transition-fast);
  z-index: 1;
  padding: var(--space-1);
}
.modal__close:hover { color: var(--color-dark); }

.modal-enter-active, .modal-leave-active {
  transition: opacity var(--transition-normal);
}
.modal-enter-active .modal, .modal-leave-active .modal {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal, .modal-leave-to .modal {
  transform: translateY(24px);
  opacity: 0;
}
</style>
