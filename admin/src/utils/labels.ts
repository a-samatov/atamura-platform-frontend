import { useI18n } from '../i18n'

export function useLabels() {
  const { t } = useI18n()

  const jkLabel = (slug: string | null): string => {
    if (!slug) return '—'
    const map: Record<string, string> = {
      atmosfera: t('jk_atmosfera'),
      keruen:    t('jk_keruen'),
      aqsai:     t('jk_aqsai'),
    }
    return map[slug] ?? slug
  }

  const typeLabel = (s: string): string => {
    const map: Record<string, string> = {
      application: t('apps_type_flat'),
      quiz: t('apps_type_quiz'),
      plan: t('apps_type_plan'),
    }
    return map[s] ?? s
  }

  const statusLabel = (s: string): string => {
    const map: Record<string, string> = {
      new: t('status_new'),
      in_progress: t('status_in_progress'),
      closed_won: t('status_closed_won'),
      closed_lost: t('status_closed_lost'),
    }
    return map[s] ?? s
  }

  const statusClass = (s: string): string => {
    const map: Record<string, string> = {
      new: 'badge badge-primary',
      in_progress: 'badge badge-warning',
      closed_won: 'badge badge-success',
      closed_lost: 'badge badge-danger',
    }
    return map[s] ?? 'badge badge-gray'
  }

  const formatDate = (iso: string): string =>
    new Date(iso).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })

  return { jkLabel, typeLabel, statusLabel, statusClass, formatDate }
}

const CYRILLIC_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'ә': 'a', 'ғ': 'gh', 'қ': 'q', 'ң': 'ng', 'ө': 'o', 'ұ': 'u',
  'ү': 'u', 'һ': 'h', 'і': 'i',
}

export const transliterate = (s: string): string =>
  s.split('').map(c => CYRILLIC_MAP[c.toLowerCase()] ?? c).join('')

export const buildSlug = (title: string): string =>
  transliterate(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
