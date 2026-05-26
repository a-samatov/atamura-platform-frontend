<template>
  <div class="fc" :class="{ 'fc--open': isOpen }">

    <!-- Всплывающая подсказка (один раз) -->
    <Transition name="fc-hint">
      <div v-if="showHint" class="fc__hint" role="status" aria-live="polite">
        <span>{{ labels.hint }}</span>
        <button class="fc__hint-close" :aria-label="labels.hintClose" @click="dismissHint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Социальные ссылки -->
    <Transition name="fc-items">
      <div v-if="isOpen" class="fc__items" role="list">

        <!-- WhatsApp -->
        <a
          :href="waLink"
          target="_blank"
          rel="noopener noreferrer"
          class="fc__item fc__item--wa"
          :aria-label="labels.whatsapp"
          role="listitem"
          @click="isOpen = false"
        >
          <span class="fc__item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.551 4.107 1.516 5.836L.044 23.544a.5.5 0 0 0 .612.612l5.708-1.472A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.806 9.806 0 0 1-5.002-1.371l-.358-.213-3.712.957.976-3.614-.234-.372A9.799 9.799 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
          </span>
          <span class="fc__item-label">{{ labels.whatsapp }}</span>
        </a>

        <!-- Instagram -->
        <a
          href="https://www.instagram.com/atamura.group/"
          target="_blank"
          rel="noopener noreferrer"
          class="fc__item fc__item--ig"
          :aria-label="labels.instagram"
          role="listitem"
          @click="isOpen = false"
        >
          <span class="fc__item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </span>
          <span class="fc__item-label">{{ labels.instagram }}</span>
        </a>

      </div>
    </Transition>

    <!-- Триггер -->
    <button
      class="fc__trigger"
      :aria-label="isOpen ? labels.close : labels.open"
      :aria-expanded="isOpen"
      @click="handleTrigger"
    >
      <Transition name="fc-icon" mode="out-in">
        <svg v-if="!isOpen" key="chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <line x1="9" y1="10" x2="15" y2="10"/>
          <line x1="9" y1="14" x2="13" y2="14"/>
        </svg>
        <svg v-else key="close" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </Transition>

      <!-- Пульс — только до первого открытия -->
      <span v-if="!hasEverOpened" class="fc__pulse" aria-hidden="true" />
    </button>

    <!-- Оверлей для закрытия по клику вне -->
    <Transition name="fc-overlay">
      <div v-if="isOpen" class="fc__overlay" aria-hidden="true" @click="isOpen = false" />
    </Transition>

  </div>
</template>

<script setup lang="ts">
// ─── Локаль ───────────────────────────────────────────────────────
const locale = useLocale()

// ─── WhatsApp ссылки по языку ─────────────────────────────────────
const waLink = computed(() => {
  const links: Record<string, string> = {
    ru: 'https://wa.me/77717091265?text=Добрый день! Пишу с вашего сайта',
    kk: 'https://wa.me/77717091265?text=Қайырлы күн! Мен сіздің веб-сайтыңыздан жазып отырмын',
    en: 'https://wa.me/77717091265?text=Good afternoon! I\'m writing from your website',
  }
  return links[locale.value] ?? links.ru
})

// ─── Переводы ─────────────────────────────────────────────────────
const i18n: Record<string, Record<string, string>> = {
  ru: {
    open:      'Связаться с менеджером',
    close:     'Закрыть меню контактов',
    hint:      'Есть вопросы? Напишите нам!',
    hintClose: 'Закрыть',
    whatsapp:  'WhatsApp',
    instagram: 'Instagram',
  },
  kk: {
    open:      'Менеджермен байланысу',
    close:     'Байланыс мәзірін жабу',
    hint:      'Сұрақтарыңыз бар ма? Бізге жазыңыз!',
    hintClose: 'Жабу',
    whatsapp:  'WhatsApp',
    instagram: 'Instagram',
  },
  en: {
    open:      'Contact a manager',
    close:     'Close contact menu',
    hint:      'Have questions? Write to us!',
    hintClose: 'Close',
    whatsapp:  'WhatsApp',
    instagram: 'Instagram',
  },
}

const labels = computed(() => i18n[locale.value] ?? i18n.ru)

// ─── Состояние ────────────────────────────────────────────────────
const isOpen        = ref(false)
const showHint      = ref(false)
const hasEverOpened = ref(false)

// ─── Открытие: убираем пульс и подсказку ─────────────────────────
function handleTrigger() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasEverOpened.value = true
    dismissHint()
    try { localStorage.setItem('fc_opened', '1') } catch {}
  }
}

// ─── Закрыть подсказку ────────────────────────────────────────────
// Вызывается только когда пользователь сам что-то сделал (открыл виджет или нажал ×)
function dismissHint() {
  showHint.value = false
  try { localStorage.setItem('fc_hint_shown', '1') } catch {}
  // Запоминаем что подсказка уже была показана — больше не показываем
}

// ─── Звук ─────────────────────────────────────────────────────────
function playSound() {
  try {
    const audio = new Audio('/sounds/notify.wav')
    audio.volume = 0.4
    audio.play().catch(() => {/* autoplay blocked — тихо игнорируем */})
  } catch {}
}

// ─── Один раз через 5 сек показываем подсказку со звуком ─────────
const hintTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  try {
    if (localStorage.getItem('fc_opened'))     hasEverOpened.value = true
    if (localStorage.getItem('fc_hint_shown')) return
  } catch {}

  window.addEventListener('keydown', onKey)

  hintTimer.value = setTimeout(() => {
    try {
      if (localStorage.getItem('fc_hint_shown')) return
    } catch {}
    showHint.value = true
    playSound()
    // НЕ скрываем автоматически — текст висит пока пользователь
    // не откроет виджет или не нажмёт крестик
  }, 5000)
})

onUnmounted(() => {
  if (hintTimer.value) clearTimeout(hintTimer.value)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
/* ─── Обёртка ─────────────────────────────────────────────────── */
.fc {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

/* ─── Оверлей ─────────────────────────────────────────────────── */
.fc__overlay {
  position: fixed;
  inset: 0;
  z-index: -1;
}

/* ─── Подсказка ───────────────────────────────────────────────── */
.fc__hint {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  font-family: var(--font-sans, 'Manrope', sans-serif);
  line-height: 1.4;
  max-width: 260px;
  position: relative;
}


@media (min-width: 768px) {
  .fc__hint {
    font-size: 16px;
    padding: 14px 18px;
    max-width: 300px;
  }
}
/* стрелка вниз к кнопке */
.fc__hint::after {
  content: '';
  position: absolute;
  bottom: -7px;
  right: 22px;
  width: 14px;
  height: 7px;
  background: var(--color-primary);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.fc__hint-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.fc__hint-close:hover { background: rgba(255, 255, 255, 0.32); }

/* ─── Список иконок ───────────────────────────────────────────── */
.fc__items {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* ─── Отдельная кнопка-ссылка ────────────────────────────────── */
.fc__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 10px 12px;
  border-radius: 50px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-sans, 'Manrope', sans-serif);
  color: #fff;
  transition: transform 0.18s ease, filter 0.18s ease;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.fc__item:hover {
  transform: translateX(-4px);
  filter: brightness(1.08);
}

.fc__item--wa { background: var(--color-primary); }

.fc__item--ig {
  background: var(--color-primary);
}

.fc__item-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* ─── Главная кнопка-триггер ─────────────────────────────────── */
.fc__trigger {
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: var(--color-primary);
  transition: transform 0.2s ease, filter 0.2s ease;
  flex-shrink: 0;
}

.fc__trigger:hover {
  transform: scale(1.07);
  filter: brightness(1.1);
}

.fc--open .fc__trigger {
  background: var(--color-gray-700, #374151);
}

/* ─── Пульс ───────────────────────────────────────────────────── */
.fc__pulse {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--color-accent, #f59e0b);
  border: 2px solid #fff;
}

.fc__pulse::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: var(--color-accent, #f59e0b);
  opacity: 0.4;
  animation: fc-pulse 2.2s ease-out infinite;
}

@keyframes fc-pulse {
  0%   { transform: scale(0.85); opacity: 0.4; }
  70%  { transform: scale(1.8);  opacity: 0; }
  100% { transform: scale(1.8);  opacity: 0; }
}

/* ─── Анимации ────────────────────────────────────────────────── */
.fc-icon-enter-active,
.fc-icon-leave-active { transition: opacity 0.14s ease, transform 0.14s ease; }
.fc-icon-enter-from   { opacity: 0; transform: rotate(-80deg) scale(0.7); }
.fc-icon-leave-to     { opacity: 0; transform: rotate(80deg)  scale(0.7); }

.fc-items-enter-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.fc-items-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.fc-items-enter-from   { opacity: 0; transform: translateY(10px) scale(0.94); }
.fc-items-leave-to     { opacity: 0; transform: translateY(6px)  scale(0.97); }

.fc-hint-enter-active  { transition: opacity 0.28s ease, transform 0.28s ease; }
.fc-hint-leave-active  { transition: opacity 0.18s ease; }
.fc-hint-enter-from    { opacity: 0; transform: translateY(8px) scale(0.95); }
.fc-hint-leave-to      { opacity: 0; }

.fc-overlay-enter-active,
.fc-overlay-leave-active { transition: opacity 0.18s ease; }
.fc-overlay-enter-from,
.fc-overlay-leave-to     { opacity: 0; }

/* ─── Мобильные (≤480px) ──────────────────────────────────────── */
@media (max-width: 480px) {
  .fc {
    bottom: 16px;
    right: 14px;
    gap: 8px;
  }

  .fc__trigger {
    width: 48px;
    height: 48px;
  }

  /* Только иконка без подписи — компактно, не мешает */
  .fc__item {
    padding: 11px;
  }

  .fc__hint {
    max-width: 180px;
    font-size: 12px;
    padding: 9px 12px;
  }
}
</style>