<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
        <NuxtLink :to="t.homeLink + '/'" class="footer__logo" aria-label="Atamura Group">
        <img src="/images/atamura_logo.png" imgfield="img" style="max-width: 160px; width: 160px; min-width: 160px; height: auto; display: block;" alt="Atamura Group Logo">
          </NuxtLink>
          <p class="footer__tagline">{{ t.tagline }}</p>
          <address class="footer__address">{{ t.address }}</address>
        </div>

        <nav class="footer__nav" :aria-label="t.navLabel">
          <div class="footer__col">
            <h3 class="footer__col-title">{{ t.cols.projects }}</h3>
            <NuxtLink :to="t.homeLink + '/jk/atmosfera'">{{ t.links.atmosfera }}</NuxtLink>
            <NuxtLink :to="t.homeLink + '/jk/keruen'">{{ t.links.keruen }}</NuxtLink>
            <NuxtLink :to="t.homeLink + '/jk/aqsai'">{{ t.links.aqsai }}</NuxtLink>
          </div>
          <div class="footer__col">
            <h3 class="footer__col-title">{{ t.cols.company }}</h3>
            <NuxtLink :to="t.homeLink + '/about'">{{ t.links.about }}</NuxtLink>
            <NuxtLink :to="t.homeLink + '/news'">{{ t.links.news }}</NuxtLink>
            <NuxtLink :to="t.homeLink + '/documents'">{{ t.links.documents }}</NuxtLink>
            <NuxtLink :to="t.homeLink + '/careers'">{{ t.links.careers }}</NuxtLink>
          </div>
          <div class="footer__col">
            <h3 class="footer__col-title">{{ t.cols.buyers }}</h3>
            <NuxtLink v-if="locale === 'ru'" :to="t.homeLink + '/mortgage'">{{ t.links.mortgage }}</NuxtLink>
            <NuxtLink :to="t.homeLink + '/contacts'">{{ t.links.contacts }}</NuxtLink>
          </div>
          <div class="footer__col">
            <h3 class="footer__col-title">{{ t.cols.contacts }}</h3>
            <a href="tel:+77273500000">+7 (727) 350-00-00</a>
            <a href="mailto:info@atamuragroup.kz">info@atamuragroup.kz</a>
            <a href="https://www.instagram.com/atamura.group/" target="_blank">Instagram</a>
            <a :href="waLink" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </nav>
      </div>

      <hr class="divider" />

      <div class="footer__bottom">
        <p class="footer__copy">© {{ currentYear }} Atamura Group. {{ t.rights }}</p>
        <NuxtLink :to="t.homeLink + '/privacy'" class="footer__copy footer__made-by-link">{{ t.privacy }}</NuxtLink>
        <a href="https://studio.qbix.kz/" target="_blank" rel="noopener noreferrer" class="footer__copy footer__made-by-link">{{ t.madeBy }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const locale = useLocale()
const currentYear = new Date().getFullYear()

const translations = {
  ru: {
    homeLink: '',
    tagline: 'Строим уверенность в завтрашнем дне',
    address: 'г. Алматы, ул. Толе би, 12',
    navLabel: 'Навигация в подвале',
    cols: { projects: 'Проекты', company: 'Компания', buyers: 'Покупателям', contacts: 'Контакты' },
    links: { atmosfera: 'ЖК Атмосфера', keruen: 'ЖК Keruen', aqsai: 'Aqsai Resort', about: 'О нас', news: 'Новости', documents: 'Документы', careers: 'Вакансии', mortgage: 'Ипотека', contacts: 'Контакты' },
    rights: 'Все права защищены.',
    rnn: 'РНН: 123456789012',
    license: 'Лицензия на строительство № 001234',
    privacy: 'Политика обработки персональных данных',
    madeBy: 'Сайт разработан в Amanix',
  },
  kk: {
    homeLink: '/kz',
    tagline: 'Ертеңге сенімділік орнатамыз',
    address: ' Алматы, Төле би көшесі, 12',
    navLabel: 'Футер навигациясы',
    cols: { projects: 'Жобалар', company: 'Компания', buyers: 'Сатып алушыларға', contacts: 'Байланыс' },
    links: { atmosfera: 'Атмосфера', keruen: 'Keruen', aqsai: 'Aqsai Resort', about: 'Біз туралы', news: 'Жаңалықтар', documents: 'Құжаттар', careers: 'Бос орындар', mortgage: 'Ипотека', contacts: 'Байланыс' },
    rights: 'Барлық құқықтар қорғалған.',
    rnn: 'ЖСН: 123456789012',
    license: 'Құрылыс лицензиясы № 001234',
    privacy: 'Дербес деректерді өңдеу саясаты',
    madeBy: 'Сайтты Amanix студиясы жасады',
  },
  en: {
    homeLink: '/en',
    tagline: 'Building confidence in tomorrow',
    address: 'Almaty, st. Tole bi, 12',
    navLabel: 'Footer navigation',
    cols: { projects: 'Projects', company: 'Company', buyers: 'For Buyers', contacts: 'Contacts' },
    links: { atmosfera: 'Atmosfera', keruen: 'Keruen', aqsai: 'Aqsai Resort', about: 'About Us', news: 'News', documents: 'Documents', careers: 'Careers', mortgage: 'Mortgage', contacts: 'Contacts' },
    rights: 'All rights reserved.',
    rnn: 'TIN: 123456789012',
    license: 'Construction Licence № 001234',
    privacy: 'Personal Data Processing Policy',
    madeBy: 'Website developed by Amanix',
  },
}

const waLink = computed(() => {
  const links: Record<string, string> = {
    ru: 'https://wa.me/77717091265?text=Добрый день! Пишу с вашего сайта',
    kk: 'https://wa.me/77717091265?text=Қайырлы күн! Мен сіздің веб-сайтыңыздан жазып отырмын',
    en: 'https://wa.me/77717091265?text=Good afternoon! I\'m writing from your website',
  }
  return links[locale.value] ?? links.ru
})

const t = computed(() => translations[locale.value as Locale] ?? translations.ru)
</script>

<style scoped>
.footer {
  background-color: var(--color-gray-100);
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-16);
  padding-bottom: var(--space-8);
}

.footer__top {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-16);
  margin-bottom: var(--space-12);
}

.footer__logo {
  display: inline-block;
  color: var(--color-primary);
  margin-bottom: var(--space-4);
}

.footer__tagline {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  margin-bottom: var(--space-3);
  line-height: var(--leading-relaxed);
}

.footer__address {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  font-style: normal;
}

.footer__nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer__col-title {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-gray-600);
  margin-bottom: var(--space-1);
}

.footer__col a {
  font-size: var(--text-sm);
  color: var(--color-gray-900);
  transition: color var(--transition-fast);
}

.footer__col a:hover {
  color: var(--color-primary);
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.footer__copy {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
}

.footer__made-by-link {
  transition: color var(--transition-fast);
}

.footer__made-by-link:hover {
  color: var(--color-primary);
}

@media (max-width: 1024px) {
  .footer__top { grid-template-columns: 1fr; gap: var(--space-8); }
  .footer__nav { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .footer__nav { grid-template-columns: 1fr; }
  .footer__bottom { flex-direction: column; align-items: flex-start; gap: var(--space-2); }
}
</style>