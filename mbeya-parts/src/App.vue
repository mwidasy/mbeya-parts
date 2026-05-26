<template>
  <div id="app">
    <RouterView />
    <BottomNav v-if="showNav" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()
const showNav = computed(() => route.name !== 'Auth')
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
#app {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100dvh;
  position: relative;
  font-family: sans-serif;
}
</style>