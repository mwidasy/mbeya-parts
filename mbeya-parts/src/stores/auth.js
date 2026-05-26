import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const store = ref(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const isSeller = computed(() => profile.value?.role === 'seller')
  const isBuyer = computed(() => profile.value?.role === 'buyer')

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    profile.value = data

    if (data?.role === 'seller') {
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', userId)
        .single()
      store.value = storeData
    }
  }

  async function signUp({ fullName, phone, password, role, storeName }) {
  loading.value = true
  const email = `${phone.replace(/\s/g, '')}@mbeya-spares.com`

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, role }
    }
  })
  if (error) { loading.value = false; throw error }

  const userId = data.user.id

  // Manually create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    full_name: fullName,
    phone,
    role
  })
  if (profileError) { loading.value = false; throw profileError }

  // If seller, create store
  if (role === 'seller' && storeName) {
    await supabase.from('stores').insert({
      owner_id: userId,
      name: storeName,
      phone
    })
  }

  user.value = data.user
  await fetchProfile(userId)
  loading.value = false
}
  
  async function signIn({ phone, password }) {
    loading.value = true
    const email = `${phone.replace(/\s/g, '')}@mbeya-spares.com`
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) { loading.value = false; throw error }
  
    user.value = data.user
    await fetchProfile(data.user.id)
    loading.value = false
  }
  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
    store.value = null
  }

  async function init() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      user.value = session.user
      await fetchProfile(session.user.id)
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      if (!session) { profile.value = null; store.value = null }
    })
  }

  return { user, profile, store, loading, isLoggedIn, isSeller, isBuyer, signUp, signIn, signOut, init, fetchProfile }
})