import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import QuizSection from '../../components/sections/QuizSection.vue'
import type { QuizContent } from '../../composables/useHomeContent'

// ── Stubs and mocks ───────────────────────────────────────────────────────────

const MOCK_CONTENT: QuizContent = {
  label:        'Подобрать квартиру',
  heading:      'Найдите свою квартиру',
  desc:         'Ответьте на 3 вопроса',
  stepPrefix:   'Шаг',
  stepOf:       'из',
  lastStepText: 'Последний шаг',
  submittedText:'Готово',
  contactPrompt:'Оставьте контакты',
  nameLabel:    'Имя',
  namePlaceholder: 'Ваше имя',
  phoneLabel:   'Телефон',
  phoneError:   'Введите телефон',
  submitBtn:    'Отправить',
  submittingBtn:'Отправка...',
  backBtn:      'Назад',
  thankTitle:   'Спасибо!',
  thankDesc:    'Мы свяжемся с вами',
  defaultName:  'Гость',
  lang:         'ru',
  questions: [
    { question: 'Какой тип квартиры?', opts: ['Студия', '1-комнатная', '2-комнатная'] },
    { question: 'Цель покупки?',       opts: ['Для себя', 'Инвестиция'] },
  ],
}

// Stub usePhoneMask — we test this separately in formatPhone.test.ts.
// The stub must actually update the ref so submitQuiz sees a non-empty phone.
vi.stubGlobal('usePhoneMask', (phoneRef: any) => ({
  handlePhoneInput:    (e: Event) => { phoneRef.value = (e.target as HTMLInputElement).value },
  handlePhoneKeypress: vi.fn(),
  handlePhoneKeydown:  vi.fn(),
}))

// $fetch — captured so we can assert it was called
const fetchSpy = vi.fn().mockResolvedValue({})
vi.stubGlobal('$fetch', fetchSpy)
vi.stubGlobal('useApiBase', () => 'http://localhost:3001/api')

function mountQuiz(content = MOCK_CONTENT) {
  return mount(QuizSection, {
    props: { content },
    global: {
      stubs: {
        AppButton:  { template: '<button @click="$emit(\'click\')"><slot /></button>', emits: ['click'] },
        Transition: { template: '<div><slot /></div>' },
      },
    },
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('QuizSection', () => {
  beforeEach(() => {
    fetchSpy.mockClear()
  })

  it('renders the first question on mount', () => {
    const wrapper = mountQuiz()
    expect(wrapper.text()).toContain('Какой тип квартиры?')
    expect(wrapper.text()).toContain('Студия')
    expect(wrapper.text()).toContain('1-комнатная')
  })

  it('shows step indicator starting at step 1', () => {
    const wrapper = mountQuiz()
    expect(wrapper.text()).toContain('Шаг 1 из 2')
  })

  it('back button is hidden on the first question', () => {
    const wrapper = mountQuiz()
    const backBtns = wrapper.findAll('.quiz-back-btn')
    expect(backBtns.length).toBe(0)
  })

  it('advances to the second question when an option is selected', async () => {
    const wrapper = mountQuiz()
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click')
    expect(wrapper.text()).toContain('Цель покупки?')
    expect(wrapper.text()).toContain('Шаг 2 из 2')
  })

  it('shows back button after advancing past step 1', async () => {
    const wrapper = mountQuiz()
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click')
    expect(wrapper.find('.quiz-back-btn').exists()).toBe(true)
  })

  it('goes back when the back button is clicked', async () => {
    const wrapper = mountQuiz()
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click') // advance to q2
    await wrapper.find('.quiz-back-btn').trigger('click')
    expect(wrapper.text()).toContain('Какой тип квартиры?')
  })

  it('shows the contact form after all questions are answered', async () => {
    const wrapper = mountQuiz()
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click') // q1
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click') // q2 → done
    expect(wrapper.text()).toContain('Оставьте контакты')
    expect(wrapper.find('#quiz-phone').exists()).toBe(true)
  })

  it('shows phone error when submitting without a phone number', async () => {
    const wrapper = mountQuiz()
    // Fast-forward to contact form
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click')
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click')

    // Click submit without filling the phone
    await wrapper.find('button').trigger('click') // AppButton stub triggers click
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Введите телефон')
  })

  it('shows thank-you screen after successful submission', async () => {
    const wrapper = mountQuiz()
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click')
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click')

    // Fill phone
    const phoneInput = wrapper.find('#quiz-phone')
    await phoneInput.setValue('+7 (700) 123-45-67')

    await wrapper.find('button').trigger('click')
    // Wait for async submission
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 0))

    expect(wrapper.text()).toContain('Спасибо!')
    expect(wrapper.text()).toContain('Мы свяжемся с вами')
  })

  it('progress bar reaches 100% after submission', async () => {
    const wrapper = mountQuiz()
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click')
    await wrapper.findAll('.quiz-panel__opt')[0].trigger('click')

    const phoneInput = wrapper.find('#quiz-phone')
    await phoneInput.setValue('+7 (700) 123-45-67')
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 0))

    const bar = wrapper.find('.quiz-progress-bar')
    expect(bar.attributes('style')).toContain('width: 100%')
  })
})
