<template>
  <nav class="bottom-nav">
    <RouterLink to="/" class="nav-item">
      <i class="ti ti-home" />
      <span>Nyumbani</span>
    </RouterLink>
    <RouterLink to="/stores" class="nav-item">
      <i class="ti ti-building-store" />
      <span>Maduka</span>
    </RouterLink>
    <RouterLink to="/search" class="nav-item">
      <i class="ti ti-search" />
      <span>Tafuta</span>
    </RouterLink>
    <RouterLink v-if="auth.isSeller" to="/dashboard" class="nav-item">
      <i class="ti ti-chart-line" />
      <span>Dashibodi</span>
    </RouterLink>
    <RouterLink to="/auth" class="nav-item">
      <i class="ti ti-user" />
      <span>{{ auth.isLoggedIn ? 'Akaunti' : 'Ingia' }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 480px;
  background: white;
  border-top: 0.5px solid #e5e7eb;
  display: flex;
  padding: 6px 0 max(8px, env(safe-area-inset-bottom));
  z-index: 100;
}
.nav-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 3px;
  text-decoration: none; color: #9ca3af;
  font-size: 9px; padding: 4px 0;
  transition: color 0.15s;
}
.nav-item i { font-size: 22px; }
.nav-item.router-link-active { color: #E85D04; }
</style>