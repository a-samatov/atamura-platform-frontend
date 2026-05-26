<template>
  <div>
    <!-- ─── Page header ──────────────────────────────────────── -->
    <section class="page-header section--dark">
      <div class="container page-header__inner">
        <AppBreadcrumb :items="[{ label: 'Басты бет', href: '/kz' }, { label: 'Компания туралы' }]" />
        <h1 class="page-header__title">Компания туралы</h1>
        <p class="page-header__sub">Atamura Group — 14 жылдық тәжірибесі бар құрылыс компаниясы</p>
      </div>
    </section>

    <!-- ─── История ─────────────────────────────────────────── -->
    <section class="section">
      <div class="container">
        <div class="about-grid">
          <div class="about-text reveal-left">
            <p class="section-label">Біздің тарих</p>
            <h2 class="section-title">2010 жылдан бастап саламыз</h2>
            <p>Atamura Group 2010 жылы жалғыз мақсатпен құрылды — тұрғыңыз келетін сапалы тұрғын үй жасау. 14 жыл ішінде Алматыда 8 тұрғын үй кешенін салып, тапсырдық.</p>
            <p>Біздің принципіміз: бір де бір мерзімді бұзу жоқ, бір де бір жабылмаған кепілдік шағым жоқ. Жобалар арасында өзара қаржыландырусыз, өз және тартылған қаражатымызбен саламыз.</p>
          </div>
          <div class="about-img reveal-right">
            <img src="/images/atamura2.webp" alt="Atamura Group командасы" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Цифры ────────────────────────────────────────────── -->
    <section class="section section--dark">
      <div class="container">
        <div class="achievements-grid">
          <div class="achievement reveal reveal-delay-1" v-for="(a, i) in achievements" :key="i">
            <div class="achievement__num">{{ a.num }}</div>
            <div class="achievement__unit">{{ a.unit }}</div>
            <p class="achievement__label">{{ a.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Ценности ─────────────────────────────────────────── -->
    <section class="section section--light">
      <div class="container">
        <div class="section-intro reveal">
          <p class="section-label">Біздің принциптер</p>
          <h2 class="section-title">Компания құндылықтары</h2>
        </div>
        <div class="values-grid">
          <div class="value-item reveal" :class="`reveal-delay-${i + 1}`" v-for="(v, i) in values" :key="v.title">
            <div class="value-item__num">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="value-item__title">{{ v.title }}</h3>
            <p class="value-item__desc">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Хронология ───────────────────────────────────────── -->
    <section class="section timeline-section">
      <div class="container">
        <div class="section-intro reveal">
          <p class="section-label">Өсу тарихы</p>
          <h2 class="section-title">Негізгі оқиғалар</h2>
        </div>
        <div class="timeline">
          <div class="timeline-item reveal" :class="i % 2 === 0 ? 'reveal-left' : 'reveal-right'" v-for="(event, i) in timeline" :key="i">
            <div class="timeline-item__year">{{ event.year }}</div>
            <div class="timeline-item__dot" aria-hidden="true" />
            <div class="timeline-item__content">
              <h3 class="timeline-item__title">{{ event.title }}</h3>
              <p class="timeline-item__desc">{{ event.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Команда ──────────────────────────────────────────── -->
    <section class="section section--light">
      <div class="container">
        <div class="section-intro reveal">
          <p class="section-label">Басшылық</p>
          <h2 class="section-title">Команда</h2>
        </div>
        <div class="team-grid">
          <div class="team-card reveal" :class="`reveal-delay-${i + 1}`" v-for="(member, i) in team" :key="member.name">
            <div class="team-card__photo">
              <img :src="member.photo" :alt="member.name" loading="lazy" />
            </div>
            <h3 class="team-card__name">{{ member.name }}</h3>
            <p class="team-card__role">{{ member.role }}</p>
            <p class="team-card__bio">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Награды ───────────────────────────────────────────── -->
    <section class="section">
      <div class="container">
        <div class="section-intro reveal">
          <p class="section-label">Мойындау</p>
          <h2 class="section-title">Марапаттар мен сертификаттар</h2>
        </div>
        <div class="awards-grid">
          <div class="award-card reveal" :class="`reveal-delay-${i + 1}`" v-for="(award, i) in awards" :key="i">
            <div class="award-card__icon" v-html="award.icon" />
            <div class="award-card__body">
              <p class="award-card__year">{{ award.year }}</p>
              <h3 class="award-card__title">{{ award.title }}</h3>
              <p class="award-card__org">{{ award.org }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA ──────────────────────────────────────────────── -->
    <section class="section section--brand about-cta-section">
      <div class="container">
        <div class="about-cta reveal">
          <h2 class="about-cta__title">Көбірек білгіңіз келе ме?</h2>
          <p class="about-cta__desc">Кеңсемізге келіңіз немесе менеджермен байланысыңыз — кез келген сұраққа жауап береміз</p>
          <div class="about-cta__actions">
            <AppButton size="lg" @click="uiStore.openModal('application')">Кеңеске жазылу</AppButton>
            <NuxtLink to="/kz/contacts"><AppButton variant="outline" size="lg">Байланыс</AppButton></NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
useSeoMeta({
  title: 'Компания туралы | Atamura Group',
  description: 'Atamura Group — 2010 жылдан бастап құрылыс компаниясы. 14 жыл тәжірибе, 8 тапсырылған ЖК, 1200-ден астам отбасы. Алматыда сапалы тұрғын үй саламыз.',
})

useHead({
  htmlAttrs: { lang: 'kk' },
  link: [
    { rel: 'canonical',  href: `${siteUrl}/kz/about` },
    { rel: 'alternate',  hreflang: 'ru',        href: `${siteUrl}/about` },
    { rel: 'alternate',  hreflang: 'kk',        href: `${siteUrl}/kz/about` },
    { rel: 'alternate',  hreflang: 'en',        href: `${siteUrl}/en/about` },
    { rel: 'alternate',  hreflang: 'x-default', href: `${siteUrl}/about` },
  ],
})

useScrollReveal()
const uiStore = useUiStore()

const achievements = [
  { num: '14', unit: 'жыл', label: 'жылжымайтын мүлік нарығында' },
  { num: '8', unit: 'ЖК', label: 'салынып, тапсырылды' },
  { num: '1 200+', unit: 'отбасы', label: 'біздің пәтерді таңдады' },
  { num: '100', unit: '%', label: 'тапсыру мерзімдерін сақтау' },
]

const values = [
  { title: 'Сенімділік', desc: '14 жыл жұмыс ішінде бір де бір мерзімді бұзбадық. Дольщиктер алдындағы барлық міндеттемелер уақытында орындалды.' },
  { title: 'Ашықтық', desc: 'Құрылыс барысы туралы тұрақты фото және бейне есептер, ашық қаржылық есептер.' },
  { title: 'Сапа', desc: 'Тек уақыт сынақтарынан өткен сертификатталған материалдар мен технологияларды қолданамыз.' },
  { title: 'Жауапкершілік', desc: 'Әрбір объектіге кепілдік қызмет. Кез келген кемшіліктерді өз есебімізден жоямыз.' },
]

const timeline = [
  { year: '2010', title: 'Компанияның негізі', desc: 'Atamura Group Алматыда құрылды. Бірінші жоба — 120 пәтерлік тұрғын үй кешені.' },
  { year: '2013', title: 'Бірінші тапсырылған объект', desc: 'Бірінші тұрғын үй кешені сәтті аяқталып, тапсырылды. 120 отбасының барлығы кілтін дәл мерзімінде алды.' },
  { year: '2016', title: 'Портфельдің кеңеюі', desc: 'Портфель 3 тұрғын үй кешенге дейін өсті. Банктермен серіктестік бағдарламасы іске қосылды.' },
  { year: '2019', title: 'Бизнес-класс', desc: 'Бизнес-класс сегментіне шығу. Авторлық сәулетпен және жабық аумақпен бірінші жобаның іске қосылуы.' },
  { year: '2022', title: '1 000 отбасы', desc: '1 000-нан астам отбасы біздің пәтерлерді таңдады. Бір де бір мерзімді бұзбаған 7 тапсырылған тұрғын үй кешені.' },
  { year: '2024', title: 'ЖК Атмосфера', desc: 'Флагмандық жоба ЖК Атмосфераның іске қосылуы — компания тарихындағы ең жақсы объект.' },
]

const team = [
  { name: 'Асет Жұмабеков', role: 'Бас директор', photo: '/images/team/ceo.png', bio: '20 жыл құрылыс саласында. Компанияны нөлден Алматы нарығының көшбасшысына дейін өсірді.' },
  { name: 'Данияр Сейтқали', role: 'Техникалық директор', photo: '/images/team/cto.png', bio: 'Құрылыс сапасын және барлық техникалық стандарттарды бақылауға жауапты.' },
  { name: 'Айгүл Нұрланова', role: 'Коммерциялық директор', photo: '/images/team/cco.png', bio: '5 банкпен серіктестік орнатты және сатып алушылар үшін ипотека бағдарламасын іске қосты.' },
]

const awards = [
  {
    year: '2023',
    title: 'Алматының үздік застройщигі',
    org: 'Риэлторлар гильдиясы',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  },
  {
    year: '2022',
    title: 'ISO 9001 сапа сертификаты',
    org: 'Bureau Veritas Kazakhstan',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
  },
  {
    year: '2021',
    title: 'Сенімді застройщик',
    org: 'Қазақстан застройщиктер қауымдастығы',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',
  },
  {
    year: '2020',
    title: 'Үздік тұрғын жоба',
    org: 'Urban Awards Kazakhstan',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  },
]
</script>

<style scoped>
.page-header { 
  display: flex;
  align-items: center;
  min-height: 350px;
  padding-top: calc(72px + var(--space-16));
  padding-bottom: var(--space-16);
  color: var(--color-white);
}

.page-header__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.page-header__title {
  font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl));
  color: var(--color-white);
}

.page-header__sub {
  font-size: var(--text-lg);
  color: rgba(255,255,255,0.75);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: var(--space-12);
  align-items: center;
}

.about-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.about-text p {
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
}

.about-img img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--radius-md);
}

/* ─── Achievements ────────────────────────────────────────────── */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.achievement {
  background: var(--color-dark);
  padding: var(--space-10) var(--space-6);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.achievement__num {
  font-family: var(--font-heading);
  font-size: clamp(var(--text-3xl), 4vw, var(--text-5xl));
  font-weight: 700;
  color: var(--color-white);
  line-height: 1;
}

.achievement__unit {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: var(--space-2);
}

.achievement__label {
  font-size: var(--text-xs);
  color: rgba(255,255,255,0.5);
  line-height: var(--leading-relaxed);
}

/* ─── Values ──────────────────────────────────────────────────── */
.section-intro { margin-bottom: var(--space-10); }

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.value-item {
  padding: var(--space-7);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--color-white);
  transition: border-color var(--transition-fast), box-shadow var(--transition-normal), transform var(--transition-normal);
}
.value-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 8px 32px rgba(0, 116, 132, 0.08);
  transform: translateY(-4px);
}

.value-item__num {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-primary-light);
  margin-bottom: var(--space-3);
  line-height: 1;
}

.value-item__title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-gray-900);
}

.value-item__desc {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
}

/* ─── Timeline ────────────────────────────────────────────────── */
.timeline-section { overflow: hidden; }

.timeline {
  position: relative;
  margin-top: var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border-color);
  transform: translateX(-50%);
}

.timeline-item {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
  gap: var(--space-6);
}

.timeline-item__year {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-primary);
  text-align: right;
  padding-top: 2px;
}

.timeline-item:nth-child(even) .timeline-item__year {
  order: 3;
  text-align: left;
}

.timeline-item__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 3px solid var(--color-white);
  box-shadow: 0 0 0 1px var(--color-primary);
  margin-top: 5px;
  flex-shrink: 0;
}

.timeline-item__content {
  padding: var(--space-5) var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-normal);
}
.timeline-item__content:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(0, 116, 132, 0.08);
}

.timeline-item:nth-child(even) .timeline-item__content {
  order: 1;
}

.timeline-item__title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.timeline-item__desc {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
}

/* ─── Team ────────────────────────────────────────────────────── */
.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.team-card {
  text-align: center;
  padding: var(--space-8) var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  transition: border-color var(--transition-fast), box-shadow var(--transition-normal), transform var(--transition-normal);
}
.team-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 8px 32px rgba(0, 116, 132, 0.08);
  transform: translateY(-4px);
}

.team-card__photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto var(--space-5);
  background-color: var(--color-gray-100);
  border: 1px solid #ececec;
}

.team-card__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-card__name {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.team-card__role {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: var(--space-3);
}

.team-card__bio {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
}

/* ─── Awards ──────────────────────────────────────────────────── */
.awards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}

.award-card {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-normal);
}
.award-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(0, 116, 132, 0.08);
}

.award-card__icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.award-card__year {
  font-size: var(--text-xs);
  color: var(--color-primary);
  font-weight: 600;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-1);
}

.award-card__title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
  line-height: var(--leading-tight);
}

.award-card__org {
  font-size: 11px;
  color: var(--color-gray-600);
}

/* ─── CTA ────────────────────────────────────────────────────── */
.about-cta {
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
}

.about-cta__title {
  font-size: clamp(var(--text-2xl), 4vw, var(--text-4xl));
  color: var(--color-gray-900);
  margin-bottom: var(--space-4);
}

.about-cta__desc {
  font-size: var(--text-base);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
}

.about-cta__actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── Responsive ──────────────────────────────────────────────── */
@media (max-width: 1200px) {
  .awards-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 1024px) {
  .about-grid { grid-template-columns: 1fr; }
  .values-grid { grid-template-columns: repeat(2, 1fr); }
  .team-grid { grid-template-columns: repeat(2, 1fr); }
  .achievements-grid { grid-template-columns: repeat(2, 1fr); }
  .timeline::before { left: var(--space-6); }
  .timeline-item { grid-template-columns: auto 1fr; }
  .timeline-item__year { order: 2 !important; text-align: left !important; }
  .timeline-item__dot { order: 1; margin-top: 5px; }
  .timeline-item__content { order: 3 !important; grid-column: 2; }
}

@media (max-width: 640px) {
  .values-grid { grid-template-columns: 1fr; }
  .team-grid { grid-template-columns: 1fr; }
  .achievements-grid { grid-template-columns: repeat(2, 1fr); }
  .awards-grid { grid-template-columns: 1fr; }
}
</style>
