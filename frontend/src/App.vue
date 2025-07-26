<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isAuthPage = route.name === 'login' || route.name === 'register'
</script>

<template>
  <div v-if="isAuthPage" class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <!-- Fullscreen centered container for login/register -->
    <RouterView />
  </div>

  <div v-else class="flex flex-col md:flex-row min-h-screen">
    <!-- Left Section: background image -->
    <div
      class="w-full md:w-3/5 h-60 md:h-auto bg-[url('@/assets/loan-management.png')] bg-no-repeat bg-center bg-cover"
    ></div>

    <!-- Right Section: main content area -->
    <div
      class="w-full md:w-2/5 bg-gray-100 flex flex-col items-center justify-center px-6 py-12 overflow-auto"
      style="min-height: 0"
    >
      <RouterView />
    </div>
  </div>
</template>
