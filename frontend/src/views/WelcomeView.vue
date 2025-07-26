<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter, RouterLink } from 'vue-router'
import { ref, computed, watch } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)

// Reactive computed property for login status
const isLoggedIn = computed(() => auth.isAuthenticated)

// import { ref, computed, watch } from 'vue'
// watch(isLoggedIn, (val) => {
//   console.log('isLoggedIn changed:', val)
// })

const handleClick = async () => {
  if (loading.value) return

  if (isLoggedIn.value) {
    loading.value = true
    // simulate logout delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    auth.logout()
    loading.value = false
    window.location.reload()
  } else {
    router.push('/auth/login')
  }
}
</script>

<template>
  <main class="max-w-lg mx-auto px-4 py-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-gray-700 text-center mb-6 leading-snug tracking-wide">
      Welcome to the system!
    </h1>

    <button
      :disabled="loading"
      type="button"
      @click="handleClick"
      class="block mx-auto w-full max-w-sm px-12 py-3 bg-[#428d5a] text-white font-semibold text-base rounded-lg shadow-md transition-colors duration-300 hover:bg-blue-700 disabled:opacity-60"
    >
      {{ loading ? (isLoggedIn ? 'Logging out…' : 'Logging in…') : (isLoggedIn ? 'Logout' : 'Login') }}
    </button>

    <div v-if="!isLoggedIn" class="mt-4 text-center text-sm text-gray-800">
      <span>Don't have an account?</span>
      <RouterLink to="/auth/register" class="ml-1 text-blue-600 font-semibold hover:underline">
        Register
      </RouterLink>
    </div>
  </main>
</template>
