import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUiStore } from '../../../stores/ui'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useUiStore — initial state', () => {
  it('starts with modal closed and no type selected', () => {
    const store = useUiStore()
    expect(store.isModalOpen).toBe(false)
    expect(store.modalData).toEqual({})
    expect(store.mobileMenuOpen).toBe(false)
  })
})

describe('useUiStore — openModal()', () => {
  it('sets isModalOpen to true', () => {
    const store = useUiStore()
    store.openModal('application')
    expect(store.isModalOpen).toBe(true)
  })

  it('sets the correct modalType', () => {
    const store = useUiStore()
    store.openModal('quiz')
    expect(store.modalType).toBe('quiz')
  })

  it('sets the correct modalType for "plan"', () => {
    const store = useUiStore()
    store.openModal('plan')
    expect(store.modalType).toBe('plan')
  })

  it('stores the provided data object', () => {
    const store = useUiStore()
    store.openModal('application', { jkSlug: 'atmosfera' })
    expect(store.modalData).toEqual({ jkSlug: 'atmosfera' })
  })

  it('uses empty object as default data', () => {
    const store = useUiStore()
    store.openModal('application')
    expect(store.modalData).toEqual({})
  })
})

describe('useUiStore — closeModal()', () => {
  it('sets isModalOpen to false', () => {
    const store = useUiStore()
    store.openModal('application')
    store.closeModal()
    expect(store.isModalOpen).toBe(false)
  })

  it('clears modalData on close', () => {
    const store = useUiStore()
    store.openModal('application', { jkSlug: 'keruen' })
    store.closeModal()
    expect(store.modalData).toEqual({})
  })
})

describe('useUiStore — mobile menu', () => {
  it('toggleMobileMenu opens a closed menu', () => {
    const store = useUiStore()
    store.toggleMobileMenu()
    expect(store.mobileMenuOpen).toBe(true)
  })

  it('toggleMobileMenu closes an open menu', () => {
    const store = useUiStore()
    store.toggleMobileMenu()
    store.toggleMobileMenu()
    expect(store.mobileMenuOpen).toBe(false)
  })

  it('closeMobileMenu always sets mobileMenuOpen to false', () => {
    const store = useUiStore()
    store.toggleMobileMenu()
    expect(store.mobileMenuOpen).toBe(true)
    store.closeMobileMenu()
    expect(store.mobileMenuOpen).toBe(false)
  })

  it('closeMobileMenu is a no-op when menu is already closed', () => {
    const store = useUiStore()
    store.closeMobileMenu()
    expect(store.mobileMenuOpen).toBe(false)
  })
})
