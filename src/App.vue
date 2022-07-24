<template>
  <AppHeader />
  <AppAside />
  <router-view />
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader';
import AppAside from '@/components/layout/AppAside';
</script>

<style lang="scss">
@import '@/assets/styles/reset.scss';
@import '@/assets/styles/common.scss';
</style>
