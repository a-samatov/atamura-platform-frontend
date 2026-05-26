<template>
  <div class="layout">
    <AppHeader />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
    <AppModal />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

main:first-child .hero {
  padding-top: 72px;
}
</style>
