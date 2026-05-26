<template>
    <div class="dashboard">
      <div class="topbar">
        <div class="topbar-info">
          <span class="topbar-title">Dashibodi</span>
          <span class="topbar-sub">{{ auth.store?.name || 'Duka lako' }}</span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <i class="ti ti-logout" />
        </button>
      </div>
  
      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card highlight">
          <div class="stat-val">{{ stats.products }}</div>
          <div class="stat-label">Bidhaa</div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-val">{{ stats.pending }}</div>
          <div class="stat-label">Maombi mapya</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ stats.delivered }}</div>
          <div class="stat-label">Zilizowasilishwa</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">TZS {{ formatPrice(stats.revenue) }}</div>
          <div class="stat-label">Mapato yote</div>
        </div>
      </div>
  
      <!-- Quick actions -->
      <div class="section-title">Vitendo vya haraka</div>
      <div class="actions-list">
        <RouterLink to="/dashboard/add-product" class="action-item">
          <div class="action-icon orange"><i class="ti ti-plus" /></div>
          <div class="action-text">
            <span>Ongeza bidhaa mpya</span>
            <small>Add new spare part listing</small>
          </div>
          <i class="ti ti-chevron-right action-arrow" />
        </RouterLink>
        <RouterLink to="/dashboard/inventory" class="action-item">
          <div class="action-icon gray"><i class="ti ti-package" /></div>
          <div class="action-text">
            <span>Simamia inventory</span>
            <small>View and update stock levels</small>
          </div>
          <i class="ti ti-chevron-right action-arrow" />
        </RouterLink>
        <RouterLink to="/dashboard/orders" class="action-item">
          <div class="action-icon blue"><i class="ti ti-shopping-bag" /></div>
          <div class="action-text">
            <span>Maombi ya wateja</span>
            <small>View and manage orders</small>
          </div>
          <i class="ti ti-chevron-right action-arrow" />
        </RouterLink>
      </div>
  
      <!-- Recent orders -->
      <div class="section-title">Maombi mapya</div>
  
      <div v-if="loadingOrders" class="loading">Inapakia...</div>
  
      <div v-else-if="orders.length === 0" class="empty">
        Hakuna maombi bado
      </div>
  
      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-item">
          <div class="order-top">
            <span class="order-id">#{{ order.id.slice(0, 8).toUpperCase() }}</span>
            <span :class="['order-status', order.status]">{{ statusLabel(order.status) }}</span>
          </div>
          <div class="order-sub">
            TZS {{ formatPrice(order.total) }} ·
            {{ formatDate(order.created_at) }}
          </div>
          <div v-if="order.notes" class="order-notes">{{ order.notes }}</div>
        </div>
      </div>
  
      <div class="bottom-spacer" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { supabase } from '@/lib/supabase'
  
  const auth = useAuthStore()
  const router = useRouter()
  
  const stats = ref({ products: 0, pending: 0, delivered: 0, revenue: 0 })
  const orders = ref([])
  const loadingOrders = ref(true)
  
  function formatPrice(val) { return Number(val || 0).toLocaleString() }
  function formatDate(val) {
    return new Date(val).toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short' })
  }
  function statusLabel(s) {
    return { pending: 'Inasubiri', confirmed: 'Imethibitishwa', delivered: 'Imewasilishwa', cancelled: 'Imefutwa' }[s] || s
  }
  
  async function handleLogout() {
    await auth.signOut()
    router.push('/')
  }
  
  onMounted(async () => {
    if (!auth.store) return
  
    const storeId = auth.store.id
  
    const [{ count: prodCount }, { data: ordersData }] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', storeId),
      supabase.from('orders').select('*').eq('store_id', storeId).order('created_at', { ascending: false }).limit(10)
    ])
  
    stats.value.products = prodCount || 0
    orders.value = ordersData || []
  
    stats.value.pending = orders.value.filter(o => o.status === 'pending').length
    stats.value.delivered = orders.value.filter(o => o.status === 'delivered').length
    stats.value.revenue = orders.value
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + Number(o.total), 0)
  
    loadingOrders.value = false
  })
  </script>
  
  <style scoped>
  .dashboard { min-height: 100dvh; background: #f9fafb; }
  
  .topbar {
    background: #E85D04; padding: 14px 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .topbar-title { color: #fff; font-size: 16px; font-weight: 700; display: block; }
  .topbar-sub { color: rgba(255,255,255,0.75); font-size: 12px; }
  .logout-btn {
    background: rgba(255,255,255,0.2); border: none; color: #fff;
    width: 36px; height: 36px; border-radius: 8px;
    font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  
  .stats-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; padding: 16px;
  }
  .stat-card {
    background: #fff; border: 0.5px solid #e5e7eb;
    border-radius: 12px; padding: 14px; text-align: center;
  }
  .stat-card.highlight { background: #fff0e6; border-color: #fbd5b5; }
  .stat-val { font-size: 22px; font-weight: 700; color: #111; }
  .stat-card.highlight .stat-val { color: #E85D04; }
  .stat-label { font-size: 11px; color: #9ca3af; margin-top: 4px; }
  
  .section-title { font-size: 14px; font-weight: 700; color: #111; padding: 8px 16px 8px; }
  
  .actions-list { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .action-item {
    display: flex; align-items: center; gap: 12px;
    background: #fff; border: 0.5px solid #e5e7eb;
    border-radius: 12px; padding: 12px; text-decoration: none;
  }
  .action-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .action-icon.orange { background: #fff0e6; color: #E85D04; }
  .action-icon.gray { background: #f3f4f6; color: #6b7280; }
  .action-icon.blue { background: #eff6ff; color: #2563eb; }
  .action-text { flex: 1; }
  .action-text span { font-size: 13px; font-weight: 600; color: #111; display: block; }
  .action-text small { font-size: 11px; color: #9ca3af; }
  .action-arrow { color: #d1d5db; font-size: 18px; }
  
  .loading, .empty { text-align: center; padding: 30px; color: #9ca3af; font-size: 13px; }
  
  .orders-list { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .order-item {
    background: #fff; border: 0.5px solid #e5e7eb;
    border-radius: 12px; padding: 12px;
  }
  .order-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .order-id { font-size: 12px; font-weight: 700; color: #111; }
  .order-status {
    font-size: 10px; padding: 3px 10px; border-radius: 20px; font-weight: 600;
  }
  .order-status.pending { background: #fff7ed; color: #c2410c; }
  .order-status.confirmed { background: #eff6ff; color: #1d4ed8; }
  .order-status.delivered { background: #dcfce7; color: #166534; }
  .order-status.cancelled { background: #fee2e2; color: #991b1b; }
  .order-sub { font-size: 11px; color: #9ca3af; }
  .order-notes { font-size: 11px; color: #6b7280; margin-top: 4px; font-style: italic; }
  
  .bottom-spacer { height: 80px; }
  </style>