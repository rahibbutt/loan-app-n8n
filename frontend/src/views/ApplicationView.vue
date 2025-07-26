<script setup lang="ts">
import { ref } from 'vue'
import type { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

interface LoanApplication {
  amount: number
  term: number
  purpose: string
}

const amount = ref<number | null>(null)
const term = ref<number | null>(null)
const purpose = ref<string>('')

const loading = ref(false)
const success = ref('')
const error = ref('')

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

async function submitApplication(): Promise<void> {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const payload: LoanApplication = {
      amount: amount.value ?? 0,
      term: term.value ?? 0,
      purpose: purpose.value,
    }

    const response = await fetch(
      'http://localhost:5678/webhook-test/ed82387f-f2e3-4cfd-8d05-66e1fd3712e7',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    const result = await response.json()

    if (response.ok) {
      success.value = result.message || 'Loan application submitted successfully!'
      amount.value = null
      term.value = null
      purpose.value = ''
    } else {
      error.value = result.message || 'Failed to submit loan application.'
    }
  } catch (e) {
    if (isAxiosErrorWithMessage(e)) {
      error.value = e.response?.data.message || 'Failed to submit loan application.'
    } else {
      error.value = 'Failed to submit loan application.'
    }
  } finally {
    loading.value = false
  }
}

function goHome() {
  router.push('/')
}
</script>


<template>
  <section class="w-full max-w-md mx-auto px-4 sm:px-0">
    <!-- Back to Home button right aligned -->
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

    <div class="bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-4xl font-bold text-center text-gray-700 mb-8">Loan Application</h2>

      <form @submit.prevent="submitApplication" class="space-y-6">
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            id="amount"
            type="number"
            v-model.number="amount"
            required
            placeholder="Enter loan amount"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#428d5a] focus:border-[#428d5a]"
          />
        </div>

        <div>
          <label for="term" class="block text-sm font-medium text-gray-700 mb-1">Term (months)</label>
          <input
            id="term"
            type="number"
            v-model.number="term"
            required
            placeholder="Enter term in months"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#428d5a] focus:border-[#428d5a]"
          />
        </div>

        <div>
          <label for="purpose" class="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
          <input
            id="purpose"
            type="text"
            v-model="purpose"
            required
            placeholder="Purpose of loan"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#428d5a] focus:border-[#428d5a]"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
        <div v-if="success" class="text-green-600 text-sm text-center">{{ success }}</div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-[#428d5a] text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Submitting...' : 'Submit Application' }}
        </button>
      </form>
    </div>
  </section>
</template>
