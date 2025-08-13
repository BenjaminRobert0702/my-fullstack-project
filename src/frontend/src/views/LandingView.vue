<template>
  <div :class="['relative min-h-screen flex items-center justify-center transition-colors duration-300', isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]']">
    
    <!-- 🌙 Dark Mode Toggle -->
    <button @click="toggleDark" class="absolute top-5 right-5 bg-black/10 text-black dark:text-white px-3 py-1 rounded-full backdrop-blur border border-black/10 dark:border-white/20 text-sm shadow-md z-10">
      {{ isDark ? '☀️ Light' : '🌙 Dark' }}
    </button>

    <!-- 🎨 Background Decorative Shapes -->
    <img src="@/assets/blob1.png" class="absolute w-60 opacity-30 top-10 left-5 blur-sm pointer-events-none" />
    <img src="@/assets/blob2.png" class="absolute w-72 opacity-20 bottom-0 right-0 blur-md pointer-events-none" />
    <img src="@/assets/circle1.png" class="absolute w-36 opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-md pointer-events-none" />

    <!-- ✨ Main Glass Card -->
    <div class="w-full max-w-md p-6 backdrop-blur-lg bg-white/50 dark:bg-white/10 border border-black/10 dark:border-white/20 rounded-2xl shadow-xl text-black dark:text-white z-10">
      <h1 class="text-2xl font-bold text-center mb-6">CHOOSE YOUR PATH</h1>
      <div class="flex justify-between gap-4">
        <button
          @click="handleStartDriving"
          class="flex-1 py-2 px-4 rounded-md bg-black/80 dark:bg-white/20 hover:opacity-90 text-white font-medium shadow transition">
          Start Driving
        </button>
        <button
          @click="handleFindARide"
          class="flex-1 py-2 px-4 rounded-md bg-black/80 dark:bg-white/20 hover:opacity-90 text-white font-medium shadow transition">
          Find A Ride
        </button>
      </div>
    </div>

    <!-- 🔓 Logout Button -->
    <button
      @click="logout"
      class="absolute bottom-6 right-6 py-2 px-4 rounded-md bg-black/70 dark:bg-white/20 text-white dark:text-white font-medium shadow-md backdrop-blur border border-white/20 hover:opacity-90 z-10">
      Logout
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import http from '@/helpers/http'
import { ref } from 'vue'

const router = useRouter()
//const isDark = ref(false)

import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()

/*const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
} */

const logout = () => {
  localStorage.removeItem('token')
  router.push({ name: 'login' })
}

const handleStartDriving = () => {
  http().get('/api/driver')
    .then((response) => {
      if (response.data.driver) {
        router.push({ name: 'standby' })
      } else {
        router.push({ name: 'driver' })
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const handleFindARide = () => {
  router.push({ name: 'location' })
}
</script>
