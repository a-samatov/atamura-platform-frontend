<template>
  <section class="section map-section" aria-labelledby="map-heading">
    <div class="container">
      <div class="section-intro reveal">
        <p class="section-label">{{ content.label }}</p>
        <h2 id="map-heading" class="section-title">{{ content.heading }}</h2>
        <p class="section-desc">{{ content.desc }}</p>
      </div>
      <div class="reveal">
        <ClientOnly>
          <YandexMap
            :markers="content.markers"
            :center="{ lat: 43.268945, lng: 76.889900 }"
            :zoom="11"
            height="480px"
          />
          <template #fallback>
            <div class="map-placeholder" aria-label="Карта загружается">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-300)" stroke-width="1" aria-hidden="true">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/>
                <line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { MapContent } from '~/composables/useHomeContent'
defineProps<{ content: MapContent }>()
</script>

<style scoped>
.map-placeholder {
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-lg);
}
</style>
