import { describe, it, expect } from 'vitest'
import { formatPhone } from '../../../composables/usePhoneMask'

// formatPhone is a pure function — no Vue/Nuxt context needed.

describe('formatPhone', () => {
  describe('empty input', () => {
    it('returns empty string for blank input', () => {
      expect(formatPhone('')).toBe('')
      expect(formatPhone('   ')).toBe('')
    })
  })

  describe('short inputs (country code only)', () => {
    it('formats a single digit as +X', () => {
      expect(formatPhone('7')).toBe('+7')
    })

    it('formats two digits as +XX', () => {
      expect(formatPhone('77')).toBe('+7 (7')
    })
  })

  describe('Kazakh/Russian number format', () => {
    it('formats 11 digits in +7 (XXX) XXX-XX-XX form', () => {
      expect(formatPhone('77001234567')).toBe('+7 (700) 123-45-67')
    })

    it('formats with leading country code already typed', () => {
      expect(formatPhone('+77001234567')).toBe('+7 (700) 123-45-67')
    })

    it('strips non-digit characters except leading +', () => {
      expect(formatPhone('8 (800) 555-35-35')).toBe('+8 (800) 555-35-35')
    })
  })

  describe('truncation', () => {
    it('caps at MAX_DIGITS (15) digits regardless of input length', () => {
      const result = formatPhone('1'.repeat(30))
      const digits = result.replace(/\D/g, '')
      expect(digits.length).toBeLessThanOrEqual(15)
    })
  })

  describe('partial inputs', () => {
    it('handles 4 digits (area code partial)', () => {
      const result = formatPhone('7700')
      expect(result).toBe('+7 (700')
    })

    it('handles 7 digits', () => {
      const result = formatPhone('7700123')
      expect(result).toBe('+7 (700) 123')
    })
  })
})
