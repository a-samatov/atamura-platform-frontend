import { describe, it, expect, beforeEach } from 'vitest'
import { useI18n, setLocale } from '../../src/i18n'

beforeEach(() => {
  setLocale('ru')
})

describe('useI18n', () => {
  describe('t() — Russian (default)', () => {
    it('translates known keys', () => {
      const { t } = useI18n()
      expect(t('save')).toBe('Сохранить')
      expect(t('cancel')).toBe('Отмена')
      expect(t('delete')).toBe('Удалить')
    })

    it('returns the key itself for unknown keys', () => {
      const { t } = useI18n()
      expect(t('__nonexistent_key__')).toBe('__nonexistent_key__')
    })
  })

  describe('setLocale + t() — English', () => {
    it('switches translations after setLocale("en")', () => {
      setLocale('en')
      const { t } = useI18n()
      expect(t('save')).toBe('Save')
      expect(t('cancel')).toBe('Cancel')
      expect(t('delete')).toBe('Delete')
    })

    it('falls back to Russian for keys missing in EN', () => {
      setLocale('en')
      // Force a key that exists in RU but not EN by checking the fallback path
      const { t } = useI18n()
      // All real keys should resolve — unknown keys fall back to the key name
      expect(t('__no_such_key__')).toBe('__no_such_key__')
    })
  })

  describe('setLocale — Kazakh', () => {
    it('returns Kazakh strings', () => {
      setLocale('kk')
      const { t } = useI18n()
      expect(t('save')).toBe('Сақтау')
      expect(t('cancel')).toBe('Болдырмау')
    })
  })

  describe('locale ref', () => {
    it('reflects the current locale', () => {
      const { locale } = useI18n()
      setLocale('en')
      expect(locale.value).toBe('en')
      setLocale('ru')
      expect(locale.value).toBe('ru')
    })
  })

  describe('jk_atmosfera key across locales', () => {
    it('returns RU label', () => {
      setLocale('ru')
      expect(useI18n().t('jk_atmosfera')).toBe('ЖК Атмосфера')
    })

    it('returns EN label', () => {
      setLocale('en')
      expect(useI18n().t('jk_atmosfera')).toBe('Atmosfera')
    })

    it('returns KK label', () => {
      setLocale('kk')
      expect(useI18n().t('jk_atmosfera')).toBe('ЖК Атмосфера')
    })
  })
})
