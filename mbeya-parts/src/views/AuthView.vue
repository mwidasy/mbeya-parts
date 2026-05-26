<template>
  <div class="auth-wrap">
    <div class="auth-logo">
      <div class="logo-mark">🔧</div>
      <h1>Mbeya Spare Parts</h1>
      <p>Ingia au jisajili kupata huduma</p>
    </div>

    <div class="mode-toggle">
      <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Ingia</button>
      <button :class="{ active: mode === 'register' }" @click="mode = 'register'">Jisajili</button>
    </div>

    <div v-if="mode === 'register'" class="role-toggle">
      <button :class="{ active: role === 'buyer' }" @click="role = 'buyer'">
        🛒 Mnunuzi
      </button>
      <button :class="{ active: role === 'seller' }" @click="role = 'seller'">
        🏪 Muuzaji
      </button>
    </div>

    <div class="form">
      <div v-if="mode === 'register'" class="field">
        <label>Jina kamili</label>
        <input v-model="form.fullName" type="text" placeholder="Jina lako kamili" />
      </div>

      <div class="field">
        <label>Nambari ya simu</label>
        <input v-model="form.phone" type="tel" placeholder="0712345678" />
      </div>

      <div class="field">
        <label>Nenosiri</label>
        <input v-model="form.password" type="password" placeholder="Nenosiri" />
      </div>

      <div v-if="mode === 'register' && role === 'seller'" class="field">
        <label>Jina la duka lako</label>
        <input v-model="form.storeName" type="text" placeholder="e.g. Mbeya Auto Spares" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button class="submit-btn" :disabled="auth.loading" @click="handleSubmit">
        {{ auth.loading ? 'Subiri...' : mode === 'login' ? 'Ingia' : 'Jisajili' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const mode = ref('login')
const role = ref('buyer')
const error = ref('')
const form = reactive({ fullName: '', phone: '', password: '', storeName: '' })

async function handleSubmit() {
  error.value = ''
  try {
    if (mode.value === 'register') {
      await auth.signUp({
        fullName: form.fullName,
        phone: form.phone,
        password: form.password,
        role: role.value,
        storeName: form.storeName
      })
    } else {
      await auth.signIn({ phone: form.phone, password: form.password })
    }

    const redirect = route.query.redirect
    if (redirect) { router.push(redirect); return }
    router.push(auth.isSeller ? '/dashboard' : '/')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<style scoped>
.auth-wrap {
  min-height: 100dvh; padding: 40px 24px 100px;
  display: flex; flex-direction: column; gap: 20px;
}
.auth-logo { text-align: center; }
.logo-mark { font-size: 40px; margin-bottom: 8px; }
h1 { font-size: 20px; font-weight: 600; color: #111; }
p { font-size: 13px; color: #6b7280; margin-top: 4px; }
.mode-toggle, .role-toggle {
  display: flex; gap: 8px;
}
.mode-toggle button, .role-toggle button {
  flex: 1; padding: 10px; border-radius: 8px;
  border: 0.5px solid #e5e7eb; background: #f9fafb;
  font-size: 13px; color: #6b7280; cursor: pointer;
  transition: all 0.15s;
}
.mode-toggle button.active, .role-toggle button.active {
  background: #E85D04; color: white; border-color: #E85D04;
}
.form { display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 12px; color: #374151; font-weight: 500; }
input {
  padding: 11px 14px; border-radius: 8px;
  border: 0.5px solid #d1d5db; background: #f9fafb;
  font-size: 14px; color: #111;
}
input:focus { outline: none; border-color: #E85D04; }
.error { font-size: 12px; color: #dc2626; }
.submit-btn {
  padding: 13px; border-radius: 8px;
  background: #E85D04; color: white; border: none;
  font-size: 14px; font-weight: 600; cursor: pointer;
  margin-top: 4px;
}
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>