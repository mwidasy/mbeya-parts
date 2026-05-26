<template>
    <div class="search-page">
      <div class="search-header">
        <RouterLink to="/" class="back-btn"><i class="ti ti-arrow-left" /></RouterLink>
        <input
          v-model="query"
          class="search-input"
          placeholder="Tafuta spea yoyote..."
          autofocus
          @input="search"
        />
      </div>
  
      <div class="filters">
        <select v-model="vehicleFilter" @change="search" class="filter-select">
          <option value="">Gari zote</option>
          <option>Toyota Hilux</option>
          <option>Toyota Land Cruiser</option>
          <option>Nissan Navara</option>
          <option>Nissan Patrol</option>
        </select>
      </div>
  
      <div v-if="loading" class="loading">Inatafuta...</div>
  
      <div v-else-if="results.length === 0 && query" class="empty">
        Hakuna matokeo kwa "{{ query }}"
      </div>
  
      <div v-else class="results">
        <RouterLink
          v-for="product in results"
          :key="product.id"
          :to="`/products/${product.id}`"
          class="result-item"
        >
          <div class="result-img">
            <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
            <i v-else class="ti ti-engine" />
          </div>
          <div class="result-info">
            <div class="result-name">{{ product.name }}</div>
            <div class="result-store">{{ product.stores?.name }}</div>
            <div class="result-price">TZS {{ Number(product.price).toLocaleString() }}</div>
          </div>
          <i class="ti ti-chevron-right result-arrow" />
        </RouterLink>
      </div>
  
      <div class="bottom-spacer" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { supabase } from '@/lib/supabase'
  
  const query = ref('')
  const vehicleFilter = ref('')
  const results = ref([])
  const loading = ref(false)
  
  let debounceTimer = null
  
  async function search() {
    clearTimeout(debounceTimer)
    if (!query.value.trim()) { results.value = []; return }
    debounceTimer = setTimeout(async () => {
      loading.value = true
      let q = supabase
        .from('products')
        .select('*, stores(name)')
        .eq('is_available', true)
        .ilike('name', `%${query.value}%`)
  
      if (vehicleFilter.value) {
        q = q.eq('vehicle_model', vehicleFilter.value)
      }
  
      const { data } = await q.limit(30)
      results.value = data || []
      loading.value = false
    }, 350)
  }
  </script>
  
  <style scoped>
  .search-page { min-height: 100dvh; background: #f9fafb; }
  .search-header {
    display: flex; align-items: center; gap: 10px;
    background: #E85D04; padding: 12px 16px;
  }
  .back-btn { color: #fff; font-size: 22px; text-decoration: none; }
  .search-input {
    flex: 1; padding: 9px 14px; border-radius: 8px; border: none;
    background: rgba(255,255,255,0.2); color: #fff; font-size: 14px;
  }
  .search-input::placeholder { color: rgba(255,255,255,0.7); }
  .search-input:focus { outline: none; background: rgba(255,255,255,0.3); }
  
  .filters { padding: 10px 16px; background: #fff; border-bottom: 0.5px solid #e5e7eb; }
  .filter-select {
    padding: 7px 12px; border-radius: 8px; border: 0.5px solid #e5e7eb;
    background: #f9fafb; font-size: 12px; color: #374151; width: 100%;
  }
  
  .loading, .empty { text-align: center; padding: 40px; color: #9ca3af; font-size: 13px; }
  
  .results { padding: 10px 16px; display: flex; flex-direction: column; gap: 8px; }
  .result-item {
    display: flex; align-items: center; gap: 12px;
    background: #fff; border: 0.5px solid #e5e7eb;
    border-radius: 12px; padding: 10px; text-decoration: none;
  }
  .result-img {
    width: 56px; height: 56px; border-radius: 8px;
    background: #f3f4f6; display: flex; align-items: center;
    justify-content: center; color: #E85D04; font-size: 24px; flex-shrink: 0;
  }
  .result-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
  .result-info { flex: 1; }
  .result-name { font-size: 13px; font-weight: 500; color: #111; line-height: 1.3; }
  .result-store { font-size: 11px; color: #9ca3af; margin-top: 2px; }
  .result-price { font-size: 13px; font-weight: 700; color: #E85D04; margin-top: 3px; }
  .result-arrow { color: #d1d5db; font-size: 18px; }
  .bottom-spacer { height: 80px; }
  </style>