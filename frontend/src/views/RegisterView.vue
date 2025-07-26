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
}

interface RegisterResponse {
  token: string
  user: User
}

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')
const error = ref<string>('')
const loading = ref<boolean>(false)
const router = useRouter()
const auth = useAuthStore()

async function handleRegister(): Promise<void> {
  error.value = ''

  if (password.value !== passwordConfirm.value) {
    error.value = "Passwords don't match"
    return
  }

  loading.value = true

  try {
    const { data } = await api.post<RegisterResponse>('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
    })

    localStorage.setItem('jwt', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    auth.login(data.user, data.token)
    router.push({ name: 'application' })
  } catch (err: unknown) {
    console.error('Register error:', err)

    if (isAxiosErrorWithMessage(err)) {
      error.value = err.response!.data.message
    } else {
      error.value = 'Registration failed. Please try again.'
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

const goHome = () => {
  router.push({ name: 'home' })
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
    <form @submit.prevent="handleRegister" class="space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-4xl font-bold text-center text-gray-700 mb-8">Create an Account</h2>

      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          id="name"
          type="text"
          v-model="name"
          required
          autocomplete="name"
          placeholder="Your full name"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#428d5a] focus:border-[#428d5a]"
        />
      </div>

      <!-- Email -->
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

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          autocomplete="new-password"
          placeholder="••••••••"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#428d5a] focus:border-[#428d5a]"
        />
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input
          id="passwordConfirm"
          type="password"
          v-model="passwordConfirm"
          required
          autocomplete="new-password"
          placeholder="••••••••"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#428d5a] focus:border-[#428d5a]"
        />
      </div>

      <!-- Error Message -->
      <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 bg-[#428d5a] text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50"
      >
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </section>
</template>


