<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="!href ? type : undefined"
    :disabled="disabled || loading"
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  href?: string
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: 500;
  letter-spacing: 0.02em;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast), color var(--transition-fast), opacity var(--transition-fast);
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ─── Sizes ─────────────────────────────── */
.btn--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

.btn--md {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
}

.btn--lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
}

/* ─── Variants ──────────────────────────── */
.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: 1px solid var(--color-primary);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.btn--secondary {
  background-color: var(--color-dark);
  color: var(--color-white);
  border: 1px solid var(--color-dark);
}

.btn--secondary:hover:not(:disabled) {
  opacity: 0.85;
}

.btn--outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn--outline:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-dark);
  border: 1px solid transparent;
}

.btn--ghost:hover:not(:disabled) {
  border-color: var(--border-color);
}

/* ─── Loading spinner ───────────────────── */
.btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
