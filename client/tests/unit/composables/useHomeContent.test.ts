import { describe, it, expect } from 'vitest'
import { useHomeContent } from '../../../composables/useHomeContent'
import type { HomeContent } from '../../../composables/useHomeContent'

const LOCALES = ['ru', 'en', 'kk'] as const

// ── Structural helpers ────────────────────────────────────────────────────────

function assertNonEmpty(value: unknown, path: string) {
  if (typeof value === 'string') {
    expect(value, `${path} should not be empty`).not.toBe('')
  } else if (Array.isArray(value)) {
    expect(value.length, `${path} should have at least one item`).toBeGreaterThan(0)
  }
}

// ── Per-locale content tests ──────────────────────────────────────────────────

describe.each(LOCALES)('useHomeContent(%s)', (locale) => {
  let c: HomeContent

  beforeEach(() => {
    c = useHomeContent(locale)
  })

  it('returns an object', () => {
    expect(typeof c).toBe('object')
    expect(c).not.toBeNull()
  })

  describe('hero', () => {
    it('has a non-empty eyebrow and at least one slide', () => {
      assertNonEmpty(c.hero.eyebrow, 'hero.eyebrow')
      assertNonEmpty(c.hero.slides, 'hero.slides')
    })

    it('every slide has heading, sub, img, and alt', () => {
      for (const slide of c.hero.slides) {
        expect(slide.heading).not.toBe('')
        expect(slide.sub).not.toBe('')
        expect(slide.img).not.toBe('')
        expect(slide.alt).not.toBe('')
      }
    })

    it('has primary and secondary button labels', () => {
      expect(c.hero.btnPrimary).not.toBe('')
      expect(c.hero.btnSecondary).not.toBe('')
    })
  })

  describe('quiz', () => {
    it('has at least one question', () => {
      expect(c.quiz.questions.length).toBeGreaterThan(0)
    })

    it('every question has text and at least two options', () => {
      for (const q of c.quiz.questions) {
        expect(q.question).not.toBe('')
        expect(q.opts.length).toBeGreaterThanOrEqual(2)
        for (const opt of q.opts) {
          expect(opt).not.toBe('')
        }
      }
    })

    it('has all required UI labels', () => {
      const labels = [
        'nameLabel', 'namePlaceholder', 'phoneLabel', 'phoneError',
        'submitBtn', 'backBtn', 'thankTitle', 'thankDesc',
        'stepPrefix', 'stepOf', 'submittedText', 'lastStepText',
      ] as const
      for (const label of labels) {
        expect(c.quiz[label], `quiz.${label} missing`).not.toBe('')
      }
    })
  })

  describe('map', () => {
    it('has at least one marker', () => {
      expect(c.map.markers.length).toBeGreaterThan(0)
    })

    it('every marker has lat, lng, and title', () => {
      for (const m of c.map.markers) {
        expect(typeof m.lat).toBe('number')
        expect(typeof m.lng).toBe('number')
        expect(m.title).not.toBe('')
      }
    })
  })

  describe('partners', () => {
    it('has at least one bank', () => {
      expect(c.partners.banks.length).toBeGreaterThan(0)
    })

    it('ctaLink is locale-appropriate', () => {
      if (locale === 'en') expect(c.partners.ctaLink).toContain('/en/')
      else if (locale === 'kk') expect(c.partners.ctaLink).toContain('/kz/')
    })
  })

  describe('jk projects', () => {
    it('has at least one project', () => {
      expect(c.jk.projects.length).toBeGreaterThan(0)
    })

    it('every project has name, href, imgAlt, and rooms list', () => {
      for (const p of c.jk.projects) {
        expect(p.name).not.toBe('')
        expect(p.href).not.toBe('')
        expect(p.imgAlt).not.toBe('')
        expect(p.tags.length).toBeGreaterThan(0)
      }
    })
  })
})

// ── Cross-locale consistency ──────────────────────────────────────────────────

describe('useHomeContent — cross-locale consistency', () => {
  it('all locales have the same top-level structure', () => {
    const keys = (locale: typeof LOCALES[number]) => Object.keys(useHomeContent(locale)).sort()
    expect(keys('ru')).toEqual(keys('en'))
    expect(keys('ru')).toEqual(keys('kk'))
  })

  it('all locales have the same number of quiz questions', () => {
    const counts = LOCALES.map(l => useHomeContent(l).quiz.questions.length)
    expect(new Set(counts).size).toBe(1)
  })

  it('all locales have the same number of slides', () => {
    const counts = LOCALES.map(l => useHomeContent(l).hero.slides.length)
    expect(new Set(counts).size).toBe(1)
  })

  it('hero slide images are locale-independent (same URLs)', () => {
    const ruSlides = useHomeContent('ru').hero.slides
    const enSlides = useHomeContent('en').hero.slides
    const kkSlides = useHomeContent('kk').hero.slides
    ruSlides.forEach((s, i) => {
      expect(s.img).toBe(enSlides[i].img)
      expect(s.img).toBe(kkSlides[i].img)
    })
  })

  it('locale-prefixed links are correct for each locale', () => {
    expect(useHomeContent('ru').partners.ctaLink).not.toContain('/en/')
    expect(useHomeContent('en').partners.ctaLink).toContain('/en/')
    expect(useHomeContent('kk').partners.ctaLink).toContain('/kz/')
  })
})
