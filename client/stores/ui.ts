import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const isModalOpen = ref(false)
  const modalType = ref<'application' | 'quiz' | 'plan'>('application')
  const modalData = ref<Record<string, unknown>>({})
  const mobileMenuOpen = ref(false)

  function openModal(type: 'application' | 'quiz' | 'plan', data: Record<string, unknown> = {}) {
    modalType.value = type
    modalData.value = data
    isModalOpen.value = true
    if (import.meta.client) {
      const scrollY = window.scrollY
      document.body.style.top = `-${scrollY}px`
      document.body.classList.add('lock-scrollbar')
      document.documentElement.classList.add('lock-scrollbar')
    }
  }

  function closeModal() {
    if (import.meta.client) {
      const top = document.body.style.top
      document.body.classList.remove('lock-scrollbar')
      document.documentElement.classList.remove('lock-scrollbar')
      document.body.style.top = ''
      if (top) window.scrollTo(0, parseInt(top) * -1)
    }
    isModalOpen.value = false
    modalData.value = {}
  }

  function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  function closeMobileMenu() {
    mobileMenuOpen.value = false
  }

  return {
    isModalOpen,
    modalType,
    modalData,
    mobileMenuOpen,
    openModal,
    closeModal,
    toggleMobileMenu,
    closeMobileMenu,
  }
})
