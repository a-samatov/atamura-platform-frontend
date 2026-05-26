export type Locale = 'ru' | 'kk' | 'en'

export function useLocale() {
  const route = useRoute()
  return computed(() => {
    if (route.path.startsWith('/kz')) return 'kk' as Locale
    if (route.path.startsWith('/en')) return 'en' as Locale
    return 'ru' as Locale
  })
}
