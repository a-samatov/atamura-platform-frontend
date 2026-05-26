import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { formatPhone, usePhoneMask, PHONE_MIN_DIGITS, PHONE_MAX_DIGITS } from '../../../composables/usePhoneMask'

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

// ── validatePhone ─────────────────────────────────────────────────────────────

describe('validatePhone', () => {
  function makeValidator(value: string) {
    const phoneRef = ref(value)
    const { validatePhone } = usePhoneMask(phoneRef)
    return validatePhone
  }

  it('returns "phone_required" for an empty string', () => {
    expect(makeValidator('')()).toBe('phone_required')
  })

  it('returns "phone_required" when only formatting chars are present', () => {
    // No digit characters — only punctuation
    expect(makeValidator('+(   ) ---')()).toBe('phone_required')
  })

  it(`returns "phone_too_short" for fewer than ${PHONE_MIN_DIGITS} digits`, () => {
    const shortPhone = '+7 (70'  // 3 digits
    expect(makeValidator(shortPhone)()).toBe('phone_too_short')
  })

  it('returns "" for a valid 11-digit Kazakh/Russian number', () => {
    expect(makeValidator('+7 (700) 123-45-67')()).toBe('')
  })

  it('returns "" at exactly the minimum digit count', () => {
    // PHONE_MIN_DIGITS digits: e.g. "1234567" → 7 digits
    const minPhone = '1'.repeat(PHONE_MIN_DIGITS)
    expect(makeValidator(minPhone)()).toBe('')
  })

  it(`returns "phone_too_long" for more than ${PHONE_MAX_DIGITS} digits`, () => {
    // validatePhone reads the raw ref value — set 16 digits directly
    const tooLong = '1234567890123456'  // 16 digits > PHONE_MAX_DIGITS (15)
    expect(makeValidator(tooLong)()).toBe('phone_too_long')
  })
})
