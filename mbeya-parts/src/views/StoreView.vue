<template>
  <div class="store-page">
    <div class="topbar">
      <RouterLink to="/stores" class="back-btn"><i class="ti ti-arrow-left" /></RouterLink>
      <span class="topbar-title">{{ store?.name || "Duka" }}</span>
    </div>
    <div v-if="store" class="store-hero">
      <div class="hero-avatar" :style="{ background: storeColor(store.name) }">{{ initials(store.name) }}</div>
      <div class="hero-name">{{ store.name }}</div>
      <div class="hero-meta">{{ store.location || "Mbeya" }}</div>
      <a v-if="store.phone" :href="`https://wa.me/255${store.phone.replace(/^0/, '')}`" class="wa-btn">
        <i class="ti ti-brand-whatsapp" /> Wasiliana na duka
      </a>
    </div>
    <div class="section-header"><span class="section-title">Bidhaa za duka hili</span></div>
    <div v-if="loading" class="loading">Inapakia...</div>
    <div v-else class="prod-grid">
      <RouterLink v-for="product in products" :key="product.id" :to="`/products/${product.id}`" class="prod-card">
        <div class="prod-img">
          <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
          <i v-else class="ti ti-engine" />
        </div>
        <div class="prod-info">
          <div v-if="product.vehicle_model" class="prod-badge">{{ product.vehicle_model }}</div>
          <div class="prod-name">{{ product.name }}</div>
          <div class="prod-price">TZS {{ Number(product.price).toLocaleString() }}</div>
        </div>
      </RouterLink>
    </div>
    <div class="bottom-spacer" />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { supabase } from "@/lib/supabase"
const route = useRoute()
const store = ref(null)
const products = ref([])
const loading = ref(true)
const colors = ["#E85D04","#C1440E","#7C3AED","#0891B2","#059669","#D97706"]
function storeColor(name) { return colors[name.charCodeAt(0) % colors.length] }
function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() }
onMounted(async () => {
  const { data: storeData } = await supabase.from("stores").select("*").eq("id", route.params.id).single()
  store.value = storeData
  const { data: productData } = await supabase.from("products").select("*").eq("store_id", route.params.id).eq("is_available", true)
  products.value = productData || []
  loading.value = false
})
</script>
<style scoped>
.store-page { min-height: 100dvh; background: #f9fafb; }
.topbar { background: #E85D04; padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { color: #fff; font-size: 22px; text-decoration: none; }
.topbar-title { color: #fff; font-size: 16px; font-weight: 700; }
.store-hero { background: #fff; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; border-bottom: 0.5px solid #e5e7eb; }
.hero-avatar { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; font-weight: 700; }
.hero-name { font-size: 18px; font-weight: 700; color: #111; }
.hero-meta { font-size: 12px; color: #9ca3af; }
.wa-btn { display: flex; align-items: center; gap: 6px; background: #25D366; color: #fff; border-radius: 8px; padding: 9px 20px; text-decoration: none; font-size: 13px; font-weight: 600; margin-top: 6px; }
.section-header { padding: 16px 16px 8px; }
.section-title { font-size: 14px; font-weight: 600; color: #111; }
.loading { text-align: center; padding: 40px; color: #9ca3af; font-size: 13px; }
.prod-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 4px 16px; }
.prod-card { background: #fff; border: 0.5px solid #e5e7eb; border-radius: 12px; overflow: hidden; text-decoration: none; }
.prod-img { height: 100px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #E85D04; font-size: 36px; }
.prod-img img { width: 100%; height: 100%; object-fit: cover; }
.prod-info { padding: 10px; }
.prod-badge { font-size: 9px; background: #fff0e6; color: #E85D04; border-radius: 4px; padding: 2px 6px; display: inline-block; margin-bottom: 4px; }
.prod-name { font-size: 12px; font-weight: 500; color: #111; line-height: 1.3; margin-bottom: 4px; }
.prod-price { font-size: 13px; font-weight: 700; color: #E85D04; }
.bottom-spacer { height: 80px; }
</style>