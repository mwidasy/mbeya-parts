<template>
    <div class="inventory">
      <div class="topbar">
        <RouterLink to="/dashboard" class="back-btn"><i class="ti ti-arrow-left" /></RouterLink>
        <span class="topbar-title">Inventory ({{ products.length }})</span>
        <RouterLink to="/dashboard/add-product" class="add-btn">
          <i class="ti ti-plus" />
        </RouterLink>
      </div>
  
      <div v-if="loading" class="loading">Inapakia...</div>
  
      <div v-else-if="products.length === 0" class="empty">
        Bado hujaweka bidhaa yoyote.
        <RouterLink to="/dashboard/add-product" class="add-link">Ongeza sasa →</RouterLink>
      </div>
  
      <div v-else class="prod-list">
        <div v-for="product in products" :key="product.id" class="prod-item">
          <div class="prod-img">
            <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
            <i v-else class="ti ti-engine" />
          </div>
          <div class="prod-info">
            <div class="prod-name">{{ product.name }}</div>
            <div class="prod-meta">
              TZS {{ Number(product.price).toLocaleString() }} · Stock: {{ product.stock }}
            </div>
            <div class="prod-actions">
              <button
                :class="['toggle-btn', product.is_available ? 'active' : 'inactive']"
                @click="toggleAvailability(product)"
              >
                {{ product.is_available ? 'Inaonekana' : 'Imefichwa' }}
              </button>
              <button class="delete-btn" @click="deleteProduct(product.id)">
                <i class="ti ti-trash" />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="bottom-spacer" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { supabase } from '@/lib/supabase'
  import { useAuthStore } from '@/stores/auth'
  
  const auth = useAuthStore()
  const products = ref([])
  const loading = ref(true)
  
  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', auth.store.id)
      .order('created_at', { ascending: false })
    products.value = data || []
    loading.value = false
  }
  
  async function toggleAvailability(product) {
    const { error } = await supabase
      .from('products')
      .update({ is_available: !product.is_available })
      .eq('id', product.id)
    if (!error) product.is_available = !product.is_available
  }
  
  async function deleteProduct(id) {
    if (!confirm('Una uhakika wa kufuta bidhaa hii?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) products.value = products.value.filter(p => p.id !== id)
  }
  
  onMounted(fetchProducts)
  </script>
  
  <style scoped>
  .inventory { min-height: 100dvh; background: #f9fafb; }
  .topbar {
    background: #E85D04; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .back-btn { color: #fff; font-size: 22px; text-decoration: none; }
  .topbar-title { color: #fff; font-size: 16px; font-weight: 700; flex: 1; }
  .add-btn { color: #fff; font-size: 24px; text-decoration: none; }
  
  .loading, .empty { text-align: center; padding: 40px; color: #9ca3af; font-size: 13px; }
  .add-link { display: block; margin-top: 10px; color: #E85D04; text-decoration: none; font-weight: 600; }
  
  .prod-list { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
  .prod-item {
    display: flex; gap: 12px; background: #fff;
    border: 0.5px solid #e5e7eb; border-radius: 12px; padding: 12px;
  }
  .prod-img {
    width: 64px; height: 64px; border-radius: 8px; flex-shrink: 0;
    background: #f3f4f6; display: flex; align-items: center;
    justify-content: center; color: #E85D04; font-size: 26px; overflow: hidden;
  }
  .prod-img img { width: 100%; height: 100%; object-fit: cover; }
  .prod-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .prod-name { font-size: 13px; font-weight: 600; color: #111; line-height: 1.3; }
  .prod-meta { font-size: 11px; color: #9ca3af; }
  .prod-actions { display: flex; gap: 8px; margin-top: 4px; }
  .toggle-btn {
    font-size: 11px; padding: 4px 12px; border-radius: 20px;
    border: none; cursor: pointer; font-weight: 600;
  }
  .toggle-btn.active { background: #dcfce7; color: #166534; }
  .toggle-btn.inactive { background: #f3f4f6; color: #6b7280; }
  .delete-btn {
    background: #fee2e2; color: #dc2626; border: none;
    border-radius: 8px; padding: 4px 10px; font-size: 14px; cursor: pointer;
  }
  .bottom-spacer { height: 80px; }
  </style>