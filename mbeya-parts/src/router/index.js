import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
  { path: '/stores', name: 'Stores', component: () => import('@/views/StoresView.vue') },
  { path: '/stores/:id', name: 'Store', component: () => import('@/views/StoreView.vue') },
  { path: '/products/:id', name: 'Product', component: () => import('@/views/ProductView.vue') },
  { path: '/search', name: 'Search', component: () => import('@/views/SearchView.vue') },
  { path: '/auth', name: 'Auth', component: () => import('@/views/AuthView.vue') },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/seller/DashboardView.vue'),
    meta: { requiresAuth: true, requiresSeller: true }
  },
  {
    path: '/dashboard/add-product',
    name: 'AddProduct',
    component: () => import('@/views/seller/AddProductView.vue'),
    meta: { requiresAuth: true, requiresSeller: true }
  },
  {
    path: '/dashboard/inventory',
    name: 'Inventory',
    component: () => import('@/views/seller/InventoryView.vue'),
    meta: { requiresAuth: true, requiresSeller: true }
  },
  {
    path: '/dashboard/orders',
    name: 'Orders',
    component: () => import('@/views/seller/OrdersView.vue'),
    meta: { requiresAuth: true, requiresSeller: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'Auth', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresSeller && !auth.isSeller) {
    return { name: 'Home' }
  }
})

export default router