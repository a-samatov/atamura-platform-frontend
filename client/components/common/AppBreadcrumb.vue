<template>
  <nav aria-label="Breadcrumb" class="breadcrumb">
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb__item"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <NuxtLink
          v-if="item.href && index < items.length - 1"
          :to="item.href"
          itemprop="item"
        >
          <span itemprop="name">{{ item.label }}</span>
        </NuxtLink>
        <span v-else itemprop="name" aria-current="page">{{ item.label }}</span>
        <meta itemprop="position" :content="String(index + 1)" />
        <span v-if="index < items.length - 1" class="breadcrumb__sep" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ label: string; href?: string }>
}>()
</script>

<style scoped>
.breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.breadcrumb__item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-gray-600);
}

.breadcrumb__item a {
  transition: color var(--transition-fast);
}

.breadcrumb__item a:hover {
  color: var(--color-primary);
}

.breadcrumb__sep {
  color: var(--color-gray-300);
}

.breadcrumb__item:last-child span[aria-current] {
  color: white;
  font-weight: 500;
}
</style>
