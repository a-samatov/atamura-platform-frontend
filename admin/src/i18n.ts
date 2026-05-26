import { ref } from 'vue'
import { ru } from './locales/ru'
import { kk } from './locales/kk'
import { en } from './locales/en'

export type Locale = 'ru' | 'kk' | 'en'

const LOCALES: Locale[] = ['ru', 'kk', 'en']
const stored = localStorage.getItem('admin_locale')
const locale = ref<Locale>(LOCALES.includes(stored as Locale) ? (stored as Locale) : 'ru')

export function setLocale(l: Locale) {
  locale.value = l
  localStorage.setItem('admin_locale', l)
}

const messages: Record<Locale, Record<string, string>> = { ru, kk, en }

export function useI18n() {
  function t(key: string): string {
    const dict: Record<string, string> = messages[locale.value as Locale] ?? messages.ru
    return dict[key] ?? messages.ru[key] ?? key
  }
  return { t, locale, setLocale }
}
