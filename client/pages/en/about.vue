<template>
  <div>
    <!-- ─── Page header ──────────────────────────────────────── -->
    <section class="page-header section--dark">
      <div class="container page-header__inner">
        <AppBreadcrumb :items="[{ label: 'Home', href: '/en' }, { label: 'About Us' }]" />
        <h1 class="page-header__title">About Us</h1>
        <p class="page-header__sub">Atamura Group — a construction company with 14 years of experience</p>
      </div>
    </section>

    <!-- ─── History ──────────────────────────────────────────── -->
    <section class="section">
      <div class="container">
        <div class="about-grid">
          <div class="about-text reveal-left">
            <p class="section-label">Our History</p>
            <h2 class="section-title">Building since 2010</h2>
            <p>Atamura Group was founded in 2010 with a single goal — to create quality housing that people love living in. Over 14 years we have built and delivered 8 residential complexes in Almaty.</p>
            <p>Our principle: zero missed deadlines, zero unresolved warranty claims. We build with our own and attracted funds without cross-financing between projects.</p>
          </div>
          <div class="about-img reveal-right">
            <img src="/images/atamura2.webp" alt="Atamura Group team" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Numbers ──────────────────────────────────────────── -->
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

    <!-- ─── Values ───────────────────────────────────────────── -->
    <section class="section section--light">
      <div class="container">
        <div class="section-intro reveal">
          <p class="section-label">Our Principles</p>
          <h2 class="section-title">Company Values</h2>
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

    <!-- ─── Timeline ─────────────────────────────────────────── -->
    <section class="section timeline-section">
      <div class="container">
        <div class="section-intro reveal">
          <p class="section-label">Growth History</p>
          <h2 class="section-title">Key Milestones</h2>
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

    <!-- ─── Team ──────────────────────────────────────────────── -->
    <section class="section section--light">
      <div class="container">
        <div class="section-intro reveal">
          <p class="section-label">Leadership</p>
          <h2 class="section-title">Our Team</h2>
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

    <!-- ─── Awards ────────────────────────────────────────────── -->
    <section class="section">
      <div class="container">
        <div class="section-intro reveal">
          <p class="section-label">Recognition</p>
          <h2 class="section-title">Awards &amp; Certificates</h2>
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
          <h2 class="about-cta__title">Ready to learn more?</h2>
          <p class="about-cta__desc">Visit our office or contact a manager — we'll answer any questions you have</p>
          <div class="about-cta__actions">
            <AppButton size="lg" @click="uiStore.openModal('application')">Book a Consultation</AppButton>
            <NuxtLink to="/en/contacts"><AppButton variant="outline" size="lg">Contacts</AppButton></NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
useSeoMeta({
  title: 'About Us | Atamura Group',
  description: 'Atamura Group — construction company since 2010. 14 years of experience, 8 completed RCs, over 1,200 families. We build quality housing in Almaty.',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical',  href: `${siteUrl}/en/about` },
    { rel: 'alternate',  hreflang: 'ru',        href: `${siteUrl}/about` },
    { rel: 'alternate',  hreflang: 'kk',        href: `${siteUrl}/kz/about` },
    { rel: 'alternate',  hreflang: 'en',        href: `${siteUrl}/en/about` },
    { rel: 'alternate',  hreflang: 'x-default', href: `${siteUrl}/about` },
  ],
})

useScrollReveal()
const uiStore = useUiStore()

const achievements = [
  { num: '14', unit: 'years', label: 'in the real estate market' },
  { num: '8', unit: 'RC', label: 'built and delivered' },
  { num: '1,200+', unit: 'families', label: 'chose our apartments' },
  { num: '100', unit: '%', label: 'compliance with delivery deadlines' },
]

const values = [
  { title: 'Reliability', desc: 'Zero missed deadlines in 14 years of work. Every commitment to buyers fulfilled on time.' },
  { title: 'Transparency', desc: 'Regular photo and video progress reports, open financial reporting.' },
  { title: 'Quality', desc: 'We use only certified materials and time-tested technologies.' },
  { title: 'Responsibility', desc: 'Warranty service for every delivered project. We fix any defects at our own expense.' },
]

const timeline = [
  { year: '2010', title: 'Company Founded', desc: 'Atamura Group established in Almaty. First project — a residential complex with 120 apartments.' },
  { year: '2013', title: 'First Completed Project', desc: 'First residential complex successfully finished and delivered. All 120 families received their keys on time.' },
  { year: '2016', title: 'Portfolio Expansion', desc: 'Portfolio grew to 3 residential complexes. Bank partnership programme launched.' },
  { year: '2019', title: 'Business Class', desc: 'Entered the business-class segment. Launch of the first project with signature architecture and secured grounds.' },
  { year: '2022', title: '1,000 Families', desc: 'Over 1,000 families chose our apartments. 7 delivered complexes with zero missed deadlines.' },
  { year: '2024', title: 'Atmosfera', desc: 'Launch of the flagship Atmosfera project — the best development in the company\'s history.' },
]

const team = [
  { name: 'Aset Zhumаbekov', role: 'CEO', photo: '/images/team/ceo.png', bio: '20 years in construction. Built the company from zero to a market leader in Almaty.' },
  { name: 'Daniyar Seitkali', role: 'CTO', photo: '/images/team/cto.png', bio: 'Responsible for construction quality and all technical standards.' },
  { name: 'Aigul Nurlanova', role: 'CCO', photo: '/images/team/cco.png', bio: 'Established partnerships with 5 banks and launched the mortgage programme for buyers.' },
]

const awards = [
  {
    year: '2023',
    title: 'Best Developer in Almaty',
    org: 'Realtors Guild',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  },
  {
    year: '2022',
    title: 'ISO 9001 Quality Certificate',
    org: 'Bureau Veritas Kazakhstan',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
  },
  {
    year: '2021',
    title: 'Trusted Developer',
    org: 'Developers Association of Kazakhstan',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',
  },
  {
    year: '2020',
    title: 'Best Residential Project',
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
