<template>
  <div v-if="documents && documents.length" class="docs-list">
    <ul>
      <li v-for="doc in documents" :key="doc.id" class="docs-list__item">
        <a :href="doc.file_url" target="_blank" rel="noopener noreferrer" class="docs-list__link">
          <svg class="docs-list__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span class="docs-list__title">{{ doc.title }}</span>
          <span v-if="doc.doc_type" class="docs-list__type">{{ docTypeLabel(doc.doc_type) }}</span>
          <svg class="docs-list__download" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '~/types/api'

defineProps<{ documents: Document[] | null }>()

function docTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    permission: 'Разрешение',
    declaration: 'Декларация',
    certificate: 'Сертификат',
    other: 'Документ',
  }
  return labels[type] ?? 'PDF'
}
</script>

<style scoped>
.docs-list ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.docs-list__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast), color var(--transition-fast);
  color: var(--color-dark);
}

.docs-list__link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.docs-list__icon {
  flex-shrink: 0;
  color: var(--color-primary);
}

.docs-list__title {
  font-weight: 500;
  font-size: var(--text-sm);
  flex: 1;
}

.docs-list__type {
  font-size: var(--text-xs);
  color: var(--color-gray-600);
  padding: 2px var(--space-2);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.docs-list__download {
  flex-shrink: 0;
  color: var(--color-gray-600);
}
</style>
