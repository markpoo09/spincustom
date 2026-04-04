<template>
  <div class="admin-layout-wrapper">
    <main class="admin-main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.admin-layout-wrapper {
  background-color: #1a1a1a;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-main-content {
  flex-grow: 1;
}
</style>
