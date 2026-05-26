<template>
  <div>
    <section class="page-header section--dark">
      <div class="container page-header__inner">
        <AppBreadcrumb :items="[{ label: 'Home', href: '/en' }, { label: 'Contacts' }]" />
        <h1 class="page-header__title">Contacts</h1>
        <p class="page-header__sub">Our sales offices are open daily</p>
      </div>
    </section>

    <section class="section">
      <div class="container contacts-grid">
        <div class="contacts-info">
          <div class="contact-block">
            <h2 class="contact-block__title">Sales Office</h2>
            <address class="contact-block__list">
              <div class="contact-line">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <a href="https://go.2gis.com/w5vOz" target="_blank">
                Almaty, microdistrict. Nurshashkan, st. Alatau 36</a>
              </div>
              <div class="contact-line">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.98 1.18 2 2 0 012.96 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                </svg>
                <a href="tel:+77273500000">+7 (727) 350-00-00</a>
              </div>
              <div class="contact-line">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>
                </svg>
                <a href="mailto:info@atamuragroup.kz">info@atamuragroup.kz</a>
              </div>
            </address>
            <div class="working-hours">
              <p class="working-hours__label">Working Hours</p>
              <p>Mon – Fri: 9:00 AM – 7:00 PM</p>
              <p>Sat: 10:00 AM – 6:00 PM</p>
              <p>Sun: 10:00 AM – 6:00 PM</p>
            </div>
          </div>
          <AppButton @click="uiStore.openModal('application')">Submit a request</AppButton>
        </div>

        <div class="contacts-map">
          <ClientOnly>
            <YandexMap
              :markers="jkMarkers"
              :center="{ lat: 43.268945, lng: 76.889900 }"
              :zoom="11"
              height="100%"
            />
            <template #fallback>
              <div class="map-placeholder" aria-label="Карта загружается">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" stroke-width="1" aria-hidden="true">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
                </svg>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const siteUrl = useSiteUrl()
const uiStore = useUiStore()
useSeoMeta({
  title: 'Contacts | Atamura Group',
  description: 'Contact Atamura Group. Sales office in Almaty: 65 Dostyk Ave. Phone: +7 (727) 350-00-00. Working hours.',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'canonical', href: `${siteUrl}/en/contacts` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/contacts` },
    { rel: 'alternate', hreflang: 'kk', href: `${siteUrl}/kz/contacts` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/contacts` },
  ],
})
const jkMarkers = [
  { lat: 43.255340, lng: 76.957853, title: 'Отдел продаж на Толе би', description: 'г. Алматы, ул. Толе би, 12' },
  { lat: 43.328407, lng: 77.019172, title: 'Отдел продаж в ЖК Атмосфера', description: 'г. Алматы, мкр. Нуршашкан, ул. Алатау' },
  { lat: 43.182382, lng: 76.816449, title: 'Отдел продаж на Жандосова', description: 'Ул. Жандосова 54 (БЦ UKO House)' },
  { lat: 43.364445, lng: 77.124499, title: 'Отдел продаж Аура', description: 'с. Тузусай, Талгарский район, ул. Сырым Датулы, 100а' },
  { lat: 43.429439, lng: 77.025712, title: 'Отдел продаж Bravo', description: 'п. Отечен Батыр, ул. Жансугурова 109' },
  { lat: 43.392038, lng: 77.024813, title: 'Отдел продаж ЖК Discovery', description: 'Алматинская область, Талгарский район, мкр. Жана Куат' },
]
</script>

<style scoped>
.page-header__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.page-header { 
  display: flex;
  align-items: center;
  min-height: 350px; padding-top: calc(72px + var(--space-12)); padding-bottom: var(--space-12); color: var(--color-white); }
.page-header__title { font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl)); color: var(--color-white); }
.page-header__sub {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.75);
}

.contacts-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: var(--space-12);
  align-items: stretch;
}

.contacts-info { display: flex; flex-direction: column; gap: var(--space-8); }

.contact-block__title { font-size: var(--text-xl); font-weight: 600; margin-bottom: var(--space-5); }

.contact-block__list { font-style: normal; display: flex; flex-direction: column; gap: var(--space-4); }

.contact-line {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-base);
  color: var(--color-gray-900);
}

.contacts-map {
  min-height: 420px;
}

.contact-line a:hover { color: var(--color-primary); }
.contact-line svg { flex-shrink: 0; color: var(--color-primary); }

.working-hours {
  margin-top: var(--space-6);
  padding: var(--space-5);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.working-hours__label {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.working-hours p { color: var(--color-gray-600); font-size: 15px; }

.contact-form-block {
  padding: var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.map-placeholder {
  width: 100%;
  height: 100%;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
}

@media (max-width: 1024px) {
  .contacts-grid {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .contacts-map {
    min-height: unset;
    aspect-ratio: 16 / 9;
  }

  .map-placeholder {
    min-height: unset;
  }
}


@media (max-width: 640px) {
  .contacts-grid {
    gap: var(--space-6);
  }

  .contacts-map {
    aspect-ratio: 4 / 3;
  }
}
</style>