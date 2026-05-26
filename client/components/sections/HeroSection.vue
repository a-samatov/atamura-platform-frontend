<template>
  <section class="hero" aria-label="Главный баннер">
    <div class="container hero__container" @mouseenter="pauseSlider" @mouseleave="resumeSlider">
      <div class="hero__left">
        <p class="hero__eyebrow">{{ content.eyebrow }}</p>
        <Transition name="slide-up" mode="out-in">
          <div :key="activeSlide" class="hero__text-group">
            <h1 class="hero__title">{{ content.slides[activeSlide].heading }}</h1>
            <p class="hero__subtitle">{{ content.slides[activeSlide].sub }}</p>
          </div>
        </Transition>
        <div class="hero__actions">
          <AppButton size="lg" @click="uiStore.openModal('application')">{{ content.btnPrimary }}</AppButton>
          <AppButton variant="outline" size="lg" class="hero__btn-outline" @click="uiStore.openModal('quiz')">{{ content.btnSecondary }}</AppButton>
        </div>
        <div class="hero__nav">
          <div class="hero__dots">
            <button
              v-for="(_, i) in content.slides"
              :key="i"
              class="hero__dot"
              :class="{ 'hero__dot--active': i === activeSlide }"
              :aria-label="`Slide ${i + 1}`"
              @click="goToSlide(i)"
            />
          </div>
          <span class="hero__counter">
            <span class="hero__counter-cur">{{ String(activeSlide + 1).padStart(2, '0') }}</span>
            <span class="hero__counter-sep">&nbsp;/&nbsp;</span>
            <span class="hero__counter-tot">{{ String(content.slides.length).padStart(2, '0') }}</span>
          </span>
        </div>
      </div>

      <div class="hero__right">
        <div
          v-for="(slide, i) in content.slides"
          :key="i"
          class="hero__slide"
          :class="{ 'hero__slide--active': i === activeSlide }"
        >
          <img
            :src="slide.img"
            :alt="slide.alt"
            class="hero__slide-img"
            :fetchpriority="i === 0 ? 'high' : undefined"
            :loading="i === 0 ? 'eager' : 'lazy'"
          />
          <div class="hero__slide-overlay" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HeroContent } from '~/composables/useHomeContent'

const props = defineProps<{ content: HeroContent }>()

const uiStore = useUiStore()
const activeSlide = ref(0)
const paused = ref(false)
let sliderTimer: ReturnType<typeof setInterval> | null = null

function goToSlide(i: number) { activeSlide.value = i; resetTimer() }

function nextSlide() {
  if (!paused.value) activeSlide.value = (activeSlide.value + 1) % props.content.slides.length
}

function resetTimer() {
  if (sliderTimer) clearInterval(sliderTimer)
  sliderTimer = setInterval(nextSlide, 6000)
}

function pauseSlider() { paused.value = true }
function resumeSlider() { paused.value = false }

onMounted(() => { sliderTimer = setInterval(nextSlide, 6000) })
onUnmounted(() => { if (sliderTimer) clearInterval(sliderTimer) })
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  background-color: var(--color-dark);
  color: var(--color-white);
  padding-top: calc(72px + var(--space-16));
  padding-bottom: var(--space-20);
  position: relative;
  min-height: 680px;
}

.hero__container {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.hero__left { display: flex; flex-direction: column; gap: var(--space-8); }

.hero__right {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.hero__slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.9s ease; }
.hero__slide--active { opacity: 1; }
.hero__slide-img { width: 100%; height: 100%; object-fit: cover; }

.hero__slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 28, 30, 0.5) 0%, transparent 50%);
}

.hero__eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.hero__text-group { display: flex; flex-direction: column; gap: var(--space-5); min-height: 160px; }

.hero__title {
  font-family: var(--font-heading);
  font-size: clamp(var(--text-3xl), 3vw, 3.3rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-white);
}

.hero__subtitle {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: rgba(255, 255, 255, 0.6);
}

.hero__actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }

.hero__btn-outline {
  color: white !important;
  border-color: rgba(255, 255, 255, 0.35) !important;
  background: transparent !important;
}
.hero__btn-outline:hover {
  border-color: rgba(255, 255, 255, 0.85) !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

.hero__nav { display: flex; align-items: center; gap: var(--space-6); }
.hero__dots { display: flex; gap: var(--space-2); }

.hero__dot {
  width: 24px;
  height: 2px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.22);
  padding: 0;
  transition: width var(--transition-normal), background-color var(--transition-normal);
  cursor: pointer;
}
.hero__dot--active { width: 40px; background: var(--color-accent); }

.hero__counter { font-size: var(--text-xs); font-family: var(--font-heading); color: rgba(255, 255, 255, 0.38); display: flex; }
.hero__counter-cur { color: rgba(255, 255, 255, 0.85); }

.slide-up-enter-active,
.slide-up-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(18px); }
.slide-up-leave-to   { opacity: 0; transform: translateY(-12px); }

@media (max-width: 1200px) { .hero__container { grid-template-columns: 1fr 1fr; gap: var(--space-10); } }
@media (max-width: 1024px) { .hero__container { grid-template-columns: 1fr; } .hero__right { aspect-ratio: 16/9; } }
@media (max-width: 768px)  { .hero__actions { flex-direction: column; align-items: flex-start; } }
</style>
