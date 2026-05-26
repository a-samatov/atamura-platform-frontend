<template>
  <header class="header" :class="{ 'header--scrolled': scrolled, 'header--hidden': headerHidden }">
    <div class="container header__inner">
      <NuxtLink :to="t.homeLink + '/'" class="header__logo" aria-label="Atamura Group — на главную">
        <img src="/images/atamura_logo.png" imgfield="img" style="max-width: 160px; width: 160px; min-width: 160px; height: auto; display: block;" alt="Atamura Group Logo">
      </NuxtLink>

      <nav class="header__nav" role="navigation" :aria-label="t.navLabel">
        <NuxtLink :to="t.homeLink + '/'" class="header__link">{{ t.nav.home }}</NuxtLink>
        <NuxtLink :to="t.homeLink + '/about'" class="header__link">{{ t.nav.about }}</NuxtLink>
        <NuxtLink :to="t.homeLink + '/projects'" class="header__link">{{ t.nav.projects }}</NuxtLink>
        <NuxtLink :to="t.homeLink + '/news'" class="header__link">{{ t.nav.news }}</NuxtLink>
        <NuxtLink :to="t.homeLink + '/contacts'" class="header__link">{{ t.nav.contacts }}</NuxtLink>
      </nav>

      <div class="header__right">
        <div class="header__lang" ref="langRef">
          <button class="header__lang-trigger" @click="langOpen = !langOpen" :aria-expanded="langOpen">
            {{ langLabel }}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" :style="{ transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-fast)' }"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div v-if="langOpen" class="header__lang-dropdown">
            <NuxtLink :to="langLinks.kk" class="header__lang-option" :class="{ active: locale === 'kk' }" @click="langOpen = false">Қазақша</NuxtLink>
            <NuxtLink :to="langLinks.ru" class="header__lang-option" :class="{ active: locale === 'ru' }" @click="langOpen = false">Русский</NuxtLink>
            <NuxtLink :to="langLinks.en" class="header__lang-option" :class="{ active: locale === 'en' }" @click="langOpen = false">English</NuxtLink>
          </div>
        </div>

        <AppButton class="header__cta-desktop" size="sm" @click="uiStore.openModal('application')">
          {{ t.cta }}
        </AppButton>

        <button
          class="header__burger"
          :class="{ active: uiStore.mobileMenuOpen }"
          @click="uiStore.toggleMobileMenu()"
          :aria-label="uiStore.mobileMenuOpen ? t.closeMenu : t.openMenu"
          :aria-expanded="uiStore.mobileMenuOpen"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>

    <div class="header__mobile" :class="{ open: uiStore.mobileMenuOpen }">
      <nav>
        <NuxtLink :to="t.homeLink + '/'" @click="uiStore.closeMobileMenu()">{{ t.nav.home }}</NuxtLink>
        <NuxtLink :to="t.homeLink + '/about'" @click="uiStore.closeMobileMenu()">{{ t.nav.about }}</NuxtLink>
        <NuxtLink :to="t.homeLink + '/projects'" @click="uiStore.closeMobileMenu()">{{ t.nav.projects }}</NuxtLink>
        <NuxtLink :to="t.homeLink + '/news'" @click="uiStore.closeMobileMenu()">{{ t.nav.news }}</NuxtLink>
        <NuxtLink :to="t.homeLink + '/contacts'" @click="uiStore.closeMobileMenu()">{{ t.nav.contacts }}</NuxtLink>
      </nav>
      <div class="header__mobile-lang">
        <NuxtLink :to="langLinks.ru" @click="uiStore.closeMobileMenu()">RU</NuxtLink>
        <NuxtLink :to="langLinks.kk" @click="uiStore.closeMobileMenu()">KZ</NuxtLink>
        <NuxtLink :to="langLinks.en" @click="uiStore.closeMobileMenu()">EN</NuxtLink>
      </div>
      <a href="tel:+77273500000" class="header__mobile-phone">+7 (727) 350-00-00</a>
      <AppButton size="sm" @click="uiStore.openModal('application'); uiStore.closeMobileMenu()">
        {{ t.cta }}
      </AppButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const uiStore = useUiStore()
const locale = useLocale()
const route = useRoute()

const RU_ONLY_PATHS = ['/jk/atmosfera/plans', '/jk/atmosfera/progress']

const langLinks = computed(() => {
  const path = route.path
  let base: string
  if (path.startsWith('/kz')) base = path.slice(3) || '/'
  else if (path.startsWith('/en')) base = path.slice(3) || '/'
  else base = path
  if (!base.startsWith('/')) base = '/' + base

  const ruOnly = base === '/' ? false : RU_ONLY_PATHS.some(p => base === p || base.startsWith(p + '/'))

  return {
    ru: base,
    kk: ruOnly ? '/kz' : '/kz' + (base === '/' ? '' : base),
    en: ruOnly ? '/en' : '/en' + (base === '/' ? '' : base),
  }
})
const { y: scrollY } = useWindowScroll()
const scrolled = computed(() => scrollY.value > 0)

// Hide header on scroll down, show on scroll up (mobile only)
const headerHidden = ref(false)
let lastScrollY = 0
watch(scrollY, (y) => {
  if (!import.meta.client) return
  if (window.innerWidth > 1024) return
  if (uiStore.mobileMenuOpen) return
  const delta = y - lastScrollY
  if (delta > 2 && y > 72) {
    headerHidden.value = true
  } else if (delta < -1) {
    headerHidden.value = false
  }
  lastScrollY = y
  langOpen.value = false
})

const langOpen = ref(false)
const langRef = ref<HTMLElement | null>(null)
const langLabel = computed(() => {
  const l = locale.value
  return ({ ru: 'RU', kk: 'KZ', en: 'EN' } as Record<Locale, string>)[l] ?? 'RU'
})

const onClickOutside = (e: MouseEvent) => {
  if (langRef.value && !langRef.value.contains(e.target as Node)) {
    langOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside, { passive: true }))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

const translations = {
  ru: {
    homeLink: '',
    navLabel: 'Основная навигация',
    nav: { home: 'Главная', jk: 'Проекты', about: 'О компании', news: 'Новости', projects: 'Проекты', contacts: 'Контакты' },
    cta: 'Записаться',
    closeMenu: 'Закрыть меню',
    openMenu: 'Открыть меню',
  },
  kk: {
    homeLink: '/kz',
    navLabel: 'Негізгі навигация',
    nav: { home: 'Басты бет', jk: 'Жобалар', about: 'Компания туралы', news: 'Жаңалықтар', projects: 'Жобалар', contacts: 'Байланыс' },
    cta: 'Жазылу',
    closeMenu: 'Мәзірді жабу',
    openMenu: 'Мәзірді ашу',
  },
  en: {
    homeLink: '/en',
    navLabel: 'Main navigation',
    nav: { home: 'Home', jk: 'Projects', about: 'About', news: 'News', projects: 'Projects', contacts: 'Contacts' },
    cta: 'Book a Call',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
  },
}

const t = computed(() => translations[locale.value as Locale] ?? translations.ru)
</script>

<style scoped>
.header { position: fixed; top: 0; left: 0; right: 0; z-index: var(--z-header); background-color: var(--color-white); border-bottom: 1px solid transparent; transition: border-color var(--transition-normal), transform 0.1s ease; }
.header--scrolled { border-bottom-color: var(--border-color); }
@media (max-width: 1024px) {
  .header--hidden { transform: translateY(-100%); }
}
.header__inner { display: flex; align-items: center; gap: var(--space-8); height: 72px; }
.header__logo { flex-shrink: 0; color: var(--color-primary); min-width: 175px;}
.header__nav { display: flex; align-items: center; gap: var(--space-6); flex: 1; justify-content: center; }
.header__link { font-size: var(--text-sm); font-weight: 500; color: #666; transition: color var(--transition-fast); position: relative; }
.header__link::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 1px; background-color: currentColor; transform: scaleX(0); transition: transform var(--transition-fast); }
.header__link.router-link-active { color: var(--color-gray-900); }
.header__right { display: flex; align-items: center; gap: var(--space-4); margin-left: auto; }
.header__lang { position: relative; }
.header__lang-trigger { display: flex; align-items: center; gap: 4px; font-size: 0.9rem; font-weight: 500; letter-spacing: 0.05em; color: var(--color-gray-600); background: none; border: none; cursor: pointer; padding: 0; transition: color var(--transition-fast); }
.header__lang-trigger:hover { color: var(--color-primary); }
.header__lang-dropdown { position: absolute; top: calc(100% + 10px); right: 0; background: var(--color-white); border: 1px solid var(--border-color); border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden; min-width: 64px; z-index: 10; }
.header__lang-option { display: block; padding: 8px 14px; font-size: 1rem; font-weight: 500; letter-spacing: 0.05em; color: var(--color-gray-600); transition: background-color var(--transition-fast), color var(--transition-fast); }
.header__lang-option:hover { background-color: var(--color-gray-50); color: var(--color-gray-900); }
.header__lang-option.active { color: var(--color-primary); font-weight: 600; }
.header__phone { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); font-weight: 500; color: var(--color-gray-900); transition: color var(--transition-fast); }
.header__phone:hover { color: var(--color-primary); }
.header__burger { display: none; flex-direction: column; gap: 5px; padding: var(--space-2); }
.header__burger span { display: block; width: 22px; height: 1.5px; background-color: currentColor; transition: transform var(--transition-fast), opacity var(--transition-fast); }
.header__burger.active span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.header__burger.active span:nth-child(2) { opacity: 0; }
.header__burger.active span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
.header__mobile { display: none; background-color: var(--color-white); border-top: 1px solid var(--border-color); padding: var(--space-6) var(--container-padding); flex-direction: column; gap: var(--space-4); }
.header__mobile.open { display: flex; }
.header__mobile nav { display: flex; flex-direction: column; gap: var(--space-4); }
.header__mobile nav a { font-size: var(--text-lg); font-weight: 500; padding-block: var(--space-2); border-bottom: 1px solid var(--border-color); }
.header__mobile-lang { display: flex; gap: var(--space-4); margin-top: var(--space-2); }
.header__mobile-phone { font-size: var(--text-xl); font-weight: 600; color: var(--color-primary); margin-top: var(--space-2); }
@media (max-width: 1024px) { .header__nav { display: none; } .header__phone { display: none; } .header__burger { display: flex; } .header__cta-desktop { display: none; } }
@media (max-width: 640px) { .header__lang { display: none; } }
</style>