import { describe, it, expect, beforeEach } from 'vitest'
import { buildSlug, transliterate, useLabels } from '../../../src/utils/labels'
import { setLocale } from '../../../src/i18n'

// ── transliterate ─────────────────────────────────────────────────────────────

describe('transliterate', () => {
  it('converts common Cyrillic letters to Latin', () => {
    expect(transliterate('привет')).toBe('privet')
    expect(transliterate('москва')).toBe('moskva')
  })

  it('handles Kazakh-specific characters', () => {
    expect(transliterate('қала')).toBe('qala')
    expect(transliterate('өмір')).toBe('omir')
    expect(transliterate('үй')).toBe('uy')
  })

  it('preserves Latin letters unchanged', () => {
    expect(transliterate('hello world')).toBe('hello world')
    expect(transliterate('test123')).toBe('test123')
  })

  it('handles mixed input', () => {
    expect(transliterate('ЖК Атмосфера')).toBe('zhk atmosfera')
  })
})

// ── buildSlug ─────────────────────────────────────────────────────────────────

describe('buildSlug', () => {
  it('transliterates Cyrillic and produces a clean slug', () => {
    expect(buildSlug('Менеджер по продажам')).toBe('menedzher-po-prodazham')
  })

  it('lowercases and strips non-slug characters', () => {
    expect(buildSlug('Hello, World!')).toBe('hello-world')
  })

  it('collapses multiple spaces and hyphens', () => {
    expect(buildSlug('test  --  case')).toBe('test-case')
  })

  it('strips leading and trailing hyphens', () => {
    const slug = buildSlug('  leading and trailing  ')
    expect(slug).not.toMatch(/^-/)
    expect(slug).not.toMatch(/-$/)
  })

  it('truncates at 80 characters', () => {
    expect(buildSlug('a'.repeat(120))).toHaveLength(80)
  })

  it('produces empty string for blank input', () => {
    expect(buildSlug('')).toBe('')
    expect(buildSlug('   ')).toBe('')
  })

  it('never produces Cyrillic in output (all chars are Latin/digit/hyphen)', () => {
    const slug = buildSlug('ЖК Атмосфера — лучший выбор!')
    expect(slug).toMatch(/^[a-z0-9-]*$/)
  })
})

// ── useLabels ─────────────────────────────────────────────────────────────────

describe('useLabels', () => {
  beforeEach(() => setLocale('ru'))

  describe('jkLabel', () => {
    it('returns translated name for known slug', () => {
      const { jkLabel } = useLabels()
      expect(jkLabel('atmosfera')).toBe('ЖК Атмосфера')
    })

    it('returns the slug itself for unknown projects', () => {
      const { jkLabel } = useLabels()
      expect(jkLabel('unknown-project')).toBe('unknown-project')
    })

    it('returns em-dash for null', () => {
      const { jkLabel } = useLabels()
      expect(jkLabel(null)).toBe('—')
    })
  })

  describe('typeLabel', () => {
    it('maps application types correctly', () => {
      const { typeLabel } = useLabels()
      expect(typeLabel('application')).toBe('Квартира')
      expect(typeLabel('quiz')).toBe('Квиз')
      expect(typeLabel('plan')).toBe('Планировка')
    })

    it('returns raw string for unknown types', () => {
      const { typeLabel } = useLabels()
      expect(typeLabel('callback')).toBe('callback')
    })
  })

  describe('statusLabel', () => {
    it('maps all known statuses', () => {
      const { statusLabel } = useLabels()
      expect(statusLabel('new')).toBe('Новая')
      expect(statusLabel('in_progress')).toBe('В работе')
      expect(statusLabel('closed_won')).toBe('Успешно')
      expect(statusLabel('closed_lost')).toBe('Отказ')
    })
  })

  describe('statusClass', () => {
    it('returns correct badge class for each status', () => {
      const { statusClass } = useLabels()
      expect(statusClass('new')).toBe('badge badge-primary')
      expect(statusClass('in_progress')).toBe('badge badge-warning')
      expect(statusClass('closed_won')).toBe('badge badge-success')
      expect(statusClass('closed_lost')).toBe('badge badge-danger')
      expect(statusClass('unknown')).toBe('badge badge-gray')
    })
  })

  describe('formatDate', () => {
    it('returns a formatted date string', () => {
      const { formatDate } = useLabels()
      const result = formatDate('2024-03-15T10:30:00Z')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('includes hours and minutes', () => {
      const { formatDate } = useLabels()
      // Formatted string should contain something that looks like time HH:MM
      expect(formatDate('2024-01-01T14:05:00Z')).toMatch(/\d+:\d+/)
    })
  })
})
