<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '../services/api.ts'
import type { AxiosError } from 'axios'

interface User {
  id: number
  name: string
  email: string
  // other user fields
}

interface LoginResponse {
  token: string
  user: User
}

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email: email.value,
      password: password.value,
    })

    //console.log('Login response data:', response.data)

    const data = response.data

    auth.login(data.user, data.token)

    // Use store login method, it handles localStorage internally
    auth.login(data.user, data.token)

    router.push({ name: 'application' })
  } catch (err: unknown) {
    if (isAxiosErrorWithMessage(err)) {
      error.value = err.response!.data.message
    } else {
      error.value = 'Login failed. Please check your credentials.'
    }
  } finally {
    loading.value = false
  }
}

function isAxiosErrorWithMessage(
  error: unknown
): error is AxiosError<{ message: string }> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true &&
    !!(error as AxiosError<{ message: string }>).response?.data?.message
  )
}

function goHome() {
  if (!loading.value) {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <section class="w-full max-w-md mx-auto px-4 sm:px-0">
    <!-- Back to Home button above the white box -->
    <div class="mb-4">
      <button
        @click="goHome"
        :disabled="loading"
        type="button"
        class="flex items-center text-[#428d5a] font-semibold hover:text-green-700 transition"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Home
      </button>
    </div>

    <!-- White box with heading inside -->
    <form @submit.prevent="handleLogin" class="space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-4xl font-bold text-center text-gray-700 mb-8">Welcome Back</h2>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          autocomplete="email"
          placeholder="you@example.com"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#428d5a] focus:border-[#428d5a]"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          autocomplete="current-password"
          placeholder="••••••••"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#428d5a] focus:border-[#428d5a]"
        />
      </div>

      <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 bg-[#428d5a] text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </section>
</template>

