<template>
    <div class="add-product">
      <div class="topbar">
        <RouterLink to="/dashboard" class="back-btn"><i class="ti ti-arrow-left" /></RouterLink>
        <span class="topbar-title">Ongeza Bidhaa</span>
      </div>
  
      <div class="form">
        <div class="field">
          <label>Jina la bidhaa *</label>
          <input v-model="form.name" type="text" placeholder="e.g. Brake Pad Toyota Hilux" />
        </div>
  
        <div class="field">
          <label>Kundi (Category) *</label>
          <select v-model="form.category_id">
            <option value="">Chagua kundi</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
  
        <div class="row">
          <div class="field">
            <label>Aina ya gari</label>
            <select v-model="form.vehicle_make">
              <option value="">Chagua</option>
              <option>Toyota</option>
              <option>Nissan</option>
              <option>Mitsubishi</option>
              <option>Isuzu</option>
              <option>Universal</option>
            </select>
          </div>
          <div class="field">
            <label>Modeli ya gari</label>
            <select v-model="form.vehicle_model">
              <option value="">Chagua</option>
              <option>Hilux</option>
              <option>Land Cruiser</option>
              <option>Navara</option>
              <option>Patrol</option>
              <option>Canter</option>
              <option>Universal</option>
            </select>
          </div>
        </div>
  
        <div class="row">
          <div class="field">
            <label>Bei (TZS) *</label>
            <input v-model="form.price" type="number" placeholder="28000" min="0" />
          </div>
          <div class="field">
            <label>Stock *</label>
            <input v-model="form.stock" type="number" placeholder="10" min="0" />
          </div>
        </div>
  
        <div class="field">
          <label>Maelezo</label>
          <textarea v-model="form.description" placeholder="Elezea bidhaa hii..." rows="3" />
        </div>
  
        <div class="field">
          <label>Picha ya bidhaa</label>
          <div class="upload-box" @click="triggerUpload">
            <img v-if="previewUrl" :src="previewUrl" class="preview-img" />
            <template v-else>
              <i class="ti ti-camera-plus upload-icon" />
              <span>Bonyeza kupiga picha au kuchagua</span>
            </template>
          </div>
          <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleFile" />
        </div>
  
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">✅ Bidhaa imehifadhiwa!</p>
  
        <button class="submit-btn" :disabled="loading" @click="handleSubmit">
          {{ loading ? 'Inahifadhi...' : 'Hifadhi Bidhaa' }}
        </button>
      </div>
  
      <div class="bottom-spacer" />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { supabase } from '@/lib/supabase'
  import { useAuthStore } from '@/stores/auth'
  
  const auth = useAuthStore()
  const router = useRouter()
  
  const categories = ref([])
  const loading = ref(false)
  const error = ref('')
  const success = ref(false)
  const fileInput = ref(null)
  const previewUrl = ref(null)
  const selectedFile = ref(null)
  
  const form = reactive({
    name: '',
    category_id: '',
    vehicle_make: '',
    vehicle_model: '',
    price: '',
    stock: '',
    description: ''
  })
  
  function triggerUpload() { fileInput.value?.click() }
  
  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
  
  async function uploadImage(file, productId) {
    const ext = file.name.split('.').pop()
    const path = `${auth.user.id}/${productId}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true })
    if (uploadError) throw uploadError
  
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }
  
  async function handleSubmit() {
    error.value = ''
    success.value = false
  
    if (!form.name || !form.price || !form.stock) {
      error.value = 'Jaza sehemu zote zinazohitajika (*)'; return
    }
  
    loading.value = true
    try {
      const productId = crypto.randomUUID()
      let imageUrl = null
  
      if (selectedFile.value) {
        imageUrl = await uploadImage(selectedFile.value, productId)
      }
  
      const { error: insertError } = await supabase.from('products').insert({
        id: productId,
        store_id: auth.store.id,
        category_id: form.category_id || null,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        vehicle_make: form.vehicle_make || null,
        vehicle_model: form.vehicle_model || null,
        image_url: imageUrl,
        is_available: true
      })
  
      if (insertError) throw insertError
  
      success.value = true
      setTimeout(() => router.push('/dashboard/inventory'), 1500)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  onMounted(async () => {
    const { data } = await supabase.from('categories').select('*')
    categories.value = data || []
  })
  </script>
  
  <style scoped>
  .add-product { min-height: 100dvh; background: #f9fafb; }
  .topbar {
    background: #E85D04; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .back-btn { color: #fff; font-size: 22px; text-decoration: none; }
  .topbar-title { color: #fff; font-size: 16px; font-weight: 700; }
  
  .form { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  
  label { font-size: 12px; font-weight: 600; color: #374151; }
  input, select, textarea {
    padding: 11px 14px; border-radius: 8px;
    border: 0.5px solid #d1d5db; background: #fff;
    font-size: 14px; color: #111; width: 100%;
  }
  input:focus, select:focus, textarea:focus {
    outline: none; border-color: #E85D04;
  }
  textarea { resize: vertical; font-family: inherit; }
  
  .upload-box {
    border: 1.5px dashed #d1d5db; border-radius: 10px;
    padding: 24px; text-align: center; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    background: #fff; transition: border-color 0.15s;
  }
  .upload-box:hover { border-color: #E85D04; }
  .upload-icon { font-size: 32px; color: #E85D04; }
  .upload-box span { font-size: 12px; color: #9ca3af; }
  .preview-img { width: 100%; max-height: 180px; object-fit: cover; border-radius: 8px; }
  
  .error { font-size: 12px; color: #dc2626; }
  .success { font-size: 13px; color: #16a34a; font-weight: 600; }
  
  .submit-btn {
    padding: 14px; border-radius: 10px;
    background: #E85D04; color: #fff; border: none;
    font-size: 14px; font-weight: 700; cursor: pointer;
  }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .bottom-spacer { height: 80px; }
  </style>