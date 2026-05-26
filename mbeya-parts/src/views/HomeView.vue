<template>
    <div class="home">
      <!-- Header -->
      <div class="topbar">
        <div class="topbar-logo">
          <span class="brand">Mbeya Spare Parts</span>
          <span class="tagline">Marketplace ya spea Mbeya</span>
        </div>
        <RouterLink to="/search" class="icon-btn">
          <i class="ti ti-search" />
        </RouterLink>
      </div>
  
      <!-- Search bar -->
      <div class="search-bar">
        <RouterLink to="/search" class="search-input-fake">
          <i class="ti ti-search" />
          <span>Tafuta spea: brake pad, filter...</span>
        </RouterLink>
      </div>
  
      <!-- Categories -->
      <div class="cat-strip">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['cat-pill', { active: selectedCategory === cat.id }]"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>
  
      <!-- Stores -->
      <div class="section-header">
        <span class="section-title">Maduka karibu nawe</span>
        <RouterLink to="/stores" class="section-link">Ona zote →</RouterLink>
      </div>
      <div class="store-row">
        <RouterLink
          v-for="store in stores"
          :key="store.id"
          :to="`/stores/${store.id}`"
          class="store-card"
        >
          <div class="store-avatar" :style="{ background: storeColor(store.name) }">
            {{ initials(store.name) }}
          </div>
          <div class="store-name">{{ store.name }}</div>
          <div class="store-meta">{{ store.location }}</div>
        </RouterLink>
      </div>
  
      <!-- Products -->
      <div class="section-header">
        <span class="section-title">Bidhaa maarufu</span>
      </div>
  
      <div v-if="loadingProducts" class="loading">Inapakia...</div>
  
      <div v-else class="prod-grid">
        <RouterLink
          v-for="product in products"
          :key="product.id"
          :to="`/products/${product.id}`"
          class="prod-card"
        >
          <div class="prod-img">
            <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
            <i v-else class="ti ti-engine" />
          </div>
          <div class="prod-info">
            <div v-if="product.vehicle_model" class="prod-badge">{{ product.vehicle_model }}</div>
            <div class="prod-name">{{ product.name }}</div>
            <div class="prod-store">{{ product.stores?.name }}</div>
            <div class="prod-price">TZS {{ formatPrice(product.price) }}</div>
          </div>
        </RouterLink>
      </div>
  
      <div class="bottom-spacer" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { supabase } from '@/lib/supabase'
  
  const categories = ref([])
  const stores = ref([])
  const products = ref([])
  const selectedCategory = ref(null)
  const loadingProducts = ref(true)
  
  const colors = ['#E85D04','#C1440E','#7C3AED','#0891B2','#059669','#D97706']
  function storeColor(name) {
    return colors[name.charCodeAt(0) % colors.length]
  }
  function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }
  function formatPrice(price) {
    return Number(price).toLocaleString()
  }
  
  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*')
    categories.value = [{ id: null, name: 'Zote' }, ...(data || [])]
  }
  
  async function fetchStores() {
    const { data } = await supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .limit(6)
    stores.value = data || []
  }
  
  async function fetchProducts() {
    loadingProducts.value = true
    let query = supabase
      .from('products')
      .select('*, stores(name)')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(20)
  
    if (selectedCategory.value) {
      query = query.eq('category_id', selectedCategory.value)
    }
  
    const { data } = await query
    products.value = data || []
    loadingProducts.value = false
  }
  
  function selectCategory(id) {
    selectedCategory.value = id
    fetchProducts()
  }
  
  onMounted(() => {
    fetchCategories()
    fetchStores()
    fetchProducts()
  })
  </script>
  
  <style scoped>
  .home { background: #f9fafb; min-height: 100dvh; }
  
  .topbar {
    background: #E85D04; padding: 14px 16px 10px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .brand { color: #fff; font-size: 15px; font-weight: 600; display: block; }
  .tagline { color: rgba(255,255,255,0.75); font-size: 11px; }
  .icon-btn { color: #fff; font-size: 22px; text-decoration: none; }
  
  .search-bar { background: #C1440E; padding: 0 16px 12px; }
  .search-input-fake {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.2); border-radius: 8px;
    padding: 9px 14px; text-decoration: none;
    color: rgba(255,255,255,0.8); font-size: 13px;
  }
  
  .cat-strip {
    display: flex; gap: 8px; padding: 12px 16px;
    overflow-x: auto; scrollbar-width: none; background: #fff;
    border-bottom: 0.5px solid #e5e7eb;
  }
  .cat-pill {
    padding: 6px 14px; border-radius: 20px; border: 0.5px solid #e5e7eb;
    background: #f9fafb; color: #6b7280; font-size: 12px;
    white-space: nowrap; cursor: pointer; transition: all 0.15s;
  }
  .cat-pill.active { background: #fff0e6; color: #E85D04; border-color: #E85D04; }
  
  .section-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 16px 8px;
  }
  .section-title { font-size: 14px; font-weight: 600; color: #111; }
  .section-link { font-size: 12px; color: #E85D04; text-decoration: none; }
  
  .store-row {
    display: flex; gap: 10px; padding: 4px 16px 12px;
    overflow-x: auto; scrollbar-width: none;
  }
  .store-card {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    min-width: 80px; text-decoration: none;
    background: #fff; border: 0.5px solid #e5e7eb;
    border-radius: 12px; padding: 10px 8px;
  }
  .store-avatar {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 15px; font-weight: 600;
  }
  .store-name { font-size: 11px; font-weight: 500; color: #111; text-align: center; line-height: 1.3; }
  .store-meta { font-size: 10px; color: #9ca3af; }
  
  .prod-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 10px; padding: 4px 16px;
  }
  .prod-card {
    background: #fff; border: 0.5px solid #e5e7eb;
    border-radius: 12px; overflow: hidden; text-decoration: none;
  }
  .prod-img {
    height: 100px; background: #f3f4f6;
    display: flex; align-items: center; justify-content: center;
    color: #E85D04; font-size: 36px;
  }
  .prod-img img { width: 100%; height: 100%; object-fit: cover; }
  .prod-info { padding: 10px; }
  .prod-badge {
    font-size: 9px; background: #fff0e6; color: #E85D04;
    border-radius: 4px; padding: 2px 6px; display: inline-block; margin-bottom: 4px;
  }
  .prod-name { font-size: 12px; font-weight: 500; color: #111; line-height: 1.3; margin-bottom: 3px; }
  .prod-store { font-size: 10px; color: #9ca3af; margin-bottom: 4px; }
  .prod-price { font-size: 13px; font-weight: 700; color: #E85D04; }
  
  .loading { text-align: center; padding: 40px; color: #9ca3af; font-size: 13px; }
  .bottom-spacer { height: 80px; }
  </style>