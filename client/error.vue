<template>
  <div class="error-page">
    <div class="error-page__bg" aria-hidden="true">
      <div class="error-page__grid" />
      <div class="error-page__glow" />
    </div>

    <header class="error-header">
      <NuxtLink to="/" class="error-header__brand">
        <img src="/images/atamura_logo.png" alt="Atamura Group" class="error-header__logo" width="160" height="37" />
      </NuxtLink>
    </header>

    <main class="error-main">
      <div class="error-code" aria-hidden="true">{{ statusCode }}</div>

      <div class="error-content">
        <p class="error-eyebrow">Atamura Group</p>

        <h1 class="error-title">
          {{ is404 ? t.notFound : t.serverError }}
        </h1>

        <p class="error-sub">
          {{ is404 ? t.notFoundSub : t.serverErrorSub }}
        </p>

        <div class="error-actions">
          <button class="error-btn error-btn--primary" @click="handleHome">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            {{ t.home }}
          </button>
          <button class="error-btn error-btn--outline" @click="handleBack">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            {{ t.back }}
          </button>
        </div>

        <nav class="error-links" :aria-label="t.quickLinks">
          <NuxtLink :to="`${prefix}/jk/atmosfera`" class="error-link">{{ t.project }}</NuxtLink>
          <span class="error-link-sep" aria-hidden="true">·</span>
          <NuxtLink :to="`${prefix}/news`" class="error-link">{{ t.news }}</NuxtLink>
          <span class="error-link-sep" aria-hidden="true">·</span>
          <NuxtLink :to="`${prefix}/#contacts`" class="error-link">{{ t.contacts }}</NuxtLink>
        </nav>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const router = useRouter()
const props = defineProps<{ error: NuxtError }>()
const statusCode = computed((): number => {
  const err = props.error as unknown as Record<string, unknown>
  return (err.status ?? err.statusCode ?? 500) as number
})
const is404 = computed(() => statusCode.value === 404)

const route = useRoute()
const prefix = computed(() => {
  if (route.path.startsWith('/kz')) return '/kz'
  if (route.path.startsWith('/en')) return '/en'
  return ''
})

const STRINGS = {
  ru: {
    notFound: 'Страница не найдена',
    notFoundSub: 'Запрашиваемая страница была удалена, перемещена или никогда не существовала.',
    serverError: 'Что-то пошло не так',
    serverErrorSub: 'Произошла внутренняя ошибка. Попробуйте обновить страницу.',
    home: 'На главную', back: 'Назад',
    quickLinks: 'Быстрые ссылки',
    project: 'ЖК Атмосфера', news: 'Новости', contacts: 'Контакты',
  },
  en: {
    notFound: 'Page not found',
    notFoundSub: 'The page you requested was removed, moved, or never existed.',
    serverError: 'Something went wrong',
    serverErrorSub: 'An internal error occurred. Try refreshing the page.',
    home: 'Go home', back: 'Go back',
    quickLinks: 'Quick links',
    project: 'Atmosfera', news: 'News', contacts: 'Contacts',
  },
  kk: {
    notFound: 'Бет табылмады',
    notFoundSub: 'Сіз сұраған бет жойылған, жылжытылған немесе ешқашан болмаған.',
    serverError: 'Бірдеңе дұрыс болмады',
    serverErrorSub: 'Ішкі қате орын алды. Бетті жаңартып көріңіз.',
    home: 'Басты бетке', back: 'Артқа',
    quickLinks: 'Жылдам сілтемелер',
    project: 'ЖК Атмосфера', news: 'Жаңалықтар', contacts: 'Байланыс',
  },
} as const

const t = computed(() => {
  if (prefix.value === '/en') return STRINGS.en
  if (prefix.value === '/kz') return STRINGS.kk
  return STRINGS.ru
})

const handleHome = () => clearError({ redirect: prefix.value || '/' })
const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    clearError({ redirect: prefix.value || '/' })
  }
}
</script>

<style scoped>
.error-page {
  min-height: 100dvh;
  background-color: #0f1c1e;
  color: #ffffff;
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ─── Background decoration ────────────────────────────────────── */
.error-page__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.error-page__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%);
}

.error-page__glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 500px;
  background: radial-gradient(ellipse at center, rgba(0, 116, 132, 0.18) 0%, transparent 70%);
  filter: blur(40px);
}

/* ─── Header ───────────────────────────────────────────────────── */
.error-header {
  position: relative;
  z-index: 1;
  padding: 28px clamp(1rem, 4vw, 2rem);
}

.error-header__brand { display: inline-flex; }
.error-header__logo { display: block; height: 37px; width: auto; filter: brightness(0) invert(1); }

/* ─── Main ─────────────────────────────────────────────────────── */
.error-main {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 clamp(1rem, 4vw, 2rem) clamp(3rem, 8vw, 6rem);
  text-align: center;
}

/* ─── Big decorative code ──────────────────────────────────────── */
.error-code {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(7rem, 22vw, 18rem);
  font-weight: 800;
  line-height: 0.85;
  letter-spacing: -0.04em;
  color: transparent;
  background: linear-gradient(135deg, rgba(0,116,132,0.25) 0%, rgba(212,168,83,0.15) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  user-select: none;
  margin-bottom: -0.1em;
}

/* ─── Content ──────────────────────────────────────────────────── */
.error-content { max-width: 520px; }

.error-eyebrow {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #007484;
  margin-bottom: 1rem;
}

.error-title {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.15;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.error-sub {
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(255,255,255,0.5);
  margin-bottom: 2.5rem;
}

/* ─── Buttons ──────────────────────────────────────────────────── */
.error-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.error-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
  white-space: nowrap;
  border: 1.5px solid transparent;
}

.error-btn--primary {
  background: #007484;
  color: #ffffff;
  border-color: #007484;
}
.error-btn--primary:hover {
  background: #005a6b;
  border-color: #005a6b;
  transform: translateY(-1px);
}

.error-btn--outline {
  background: transparent;
  color: rgba(255,255,255,0.7);
  border-color: rgba(255,255,255,0.15);
}
.error-btn--outline:hover {
  border-color: rgba(255,255,255,0.35);
  color: #ffffff;
  transform: translateY(-1px);
}

/* ─── Quick links ──────────────────────────────────────────────── */
.error-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.error-link {
  font-size: 0.875rem;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  transition: color 150ms ease;
}
.error-link:hover { color: rgba(255,255,255,0.8); }

.error-link-sep {
  color: rgba(255,255,255,0.2);
  font-size: 0.875rem;
}

@media (max-width: 480px) {
  .error-actions { flex-direction: column; align-items: stretch; }
  .error-btn { justify-content: center; }
}
</style>
