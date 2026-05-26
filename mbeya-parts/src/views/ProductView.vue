<template>
  <div class="product-page">
    <div class="topbar">
      <button class="back-btn" @click="router.back()"><i class="ti ti-arrow-left" /></button>
      <span class="topbar-title">Maelezo ya Bidhaa</span>
    </div>
    <div v-if="loading" class="loading">Inapakia...</div>
    <template v-else-if="product">
      <div class="prod-img">
        <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
        <i v-else class="ti ti-engine" />
      </div>
      <div class="prod-body">
        <div class="prod-top">
          <div class="prod-name">{{ product.name }}</div>
          <div class="prod-price">TZS {{ Number(product.price).toLocaleString() }}</div>
        </div>
        <div class="prod-tags">
          <span v-if="product.vehicle_model" class="badge orange">{{ product.vehicle_model }}</span>
          <span v-if="product.vehicle_make" class="badge gray">{{ product.vehicle_make }}</span>
          <span :class="['badge', product.stock > 0 ? 'green' : 'red']">
            {{ product.stock > 0 ? `Inapatikana (${product.stock})` : "Haipatikani" }}
          </span>
        </div>
        <p v-if="product.description" class="prod-desc">{{ product.description }}</p>
        <RouterLink v-if="product.stores" :to="`/stores/${product.store_id}`" class="store-card">
          <div class="store-avatar" :style="{ background: storeColor(product.stores.name) }">{{ initials(product.stores.name) }}</div>
          <div class="store-info">
            <div class="store-name">{{ product.stores.name }}</div>
            <div class="store-meta">{{ product.stores.location || "Mbeya" }}</div>
          </div>
          <i class="ti ti-chevron-right" style="color:#d1d5db" />
        </RouterLink>
        <div class="actions">
          <a v-if="product.stores?.phone" :href="`https://wa.me/255${product.stores.phone.replace(/^0/, '')}?text=Habari, ninahitaji: ${encodeURIComponent(product.name)}`" class="btn-wa">
            <i class="ti ti-brand-whatsapp" /> Wasiliana
          </a>
          <button class="btn-cart" @click="addToCart">
            <i class="ti ti-shopping-cart-plus" /> Ongeza Cart
          </button>
        </div>
      </div>
    </template>
    <div class="bottom-spacer" />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { supabase } from "@/lib/supabase"
const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)
const colors = ["#E85D04","#C1440E","#7C3AED","#0891B2","#059669","#D97706"]
function storeColor(name) { return colors[name.charCodeAt(0) % colors.length] }
function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() }
function addToCart() { alert("Cart feature inakuja hivi karibuni!") }
onMounted(async () => {
  const { data } = await supabase.from("products").select("*, stores(name, phone, location)").eq("id", route.params.id).single()
  product.value = data
  loading.value = false
})
</script>
<style scoped>
.product-page { min-height: 100dvh; background: #f9fafb; }
.topbar { background: #E85D04; padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; padding: 0; }
.topbar-title { color: #fff; font-size: 16px; font-weight: 700; }
.loading { text-align: center; padding: 60px; color: #9ca3af; font-size: 13px; }
.prod-img { height: 220px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #E85D04; font-size: 72px; }
.prod-img img { width: 100%; height: 100%; object-fit: cover; }
.prod-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.prod-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.prod-name { font-size: 17px; font-weight: 700; color: #111; flex: 1; line-height: 1.4; }
.prod-price { font-size: 18px; font-weight: 700; color: #E85D04; flex-shrink: 0; }
.prod-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.badge { font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
.badge.orange { background: #fff0e6; color: #E85D04; }
.badge.gray { background: #f3f4f6; color: #6b7280; }
.badge.green { background: #dcfce7; color: #166534; }
.badge.red { background: #fee2e2; color: #991b1b; }
.prod-desc { font-size: 13px; color: #6b7280; line-height: 1.7; }
.store-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 0.5px solid #e5e7eb; border-radius: 12px; padding: 12px; text-decoration: none; }
.store-avatar { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 15px; font-weight: 600; flex-shrink: 0; }
.store-info { flex: 1; }
.store-name { font-size: 13px; font-weight: 600; color: #111; }
.store-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.btn-wa, .btn-cart { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 13px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; }
.btn-wa { background: #25D366; color: #fff; border: none; }
.btn-cart { background: #E85D04; color: #fff; border: none; }
.bottom-spacer { height: 80px; }
</style>