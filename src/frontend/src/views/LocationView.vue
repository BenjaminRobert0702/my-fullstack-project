<template>
  <div :class="['min-h-screen flex items-center justify-center transition-colors duration-300 px-4', isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]']">
    
    <!-- Dark mode toggle -->
    <button @click="toggleDark" class="absolute top-5 right-5 bg-black/10 text-black dark:text-white px-3 py-1 rounded-full backdrop-blur border border-black/10 dark:border-white/20 text-sm shadow-md">
      {{ isDark ? '☀️ Light' : '🌙 Dark' }}
    </button>

    <!-- Decorative shapes -->
    <div class="absolute w-80 h-80 bg-blue-300 opacity-30 rounded-full blur-3xl -top-40 -left-40"></div>
    <div class="absolute w-96 h-96 bg-pink-300 opacity-20 rounded-full blur-3xl -bottom-40 -right-40"></div>

    <div class="w-full max-w-md p-6 backdrop-blur-lg bg-white/50 dark:bg-white/10 border border-black/10 dark:border-white/20 rounded-2xl shadow-xl text-black dark:text-white">
      <h1 class="text-2xl font-bold text-center mb-6">Pick your Destination</h1>

      <form @submit.prevent="handleSelectLocation">
        <GMapAutocomplete
          placeholder="Where do you want to go?"
          @place_changed="handleLocationChanged"
          class="w-full px-4 py-3 mb-4 rounded-md border border-black/20 dark:border-white/30 bg-white/60 dark:bg-white/10 placeholder-black/50 dark:placeholder-white/60 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/40 dark:focus:ring-white/30"
        />
        <button
          type="submit"
          class="w-full py-2 px-4 rounded-md bg-black/80 dark:bg-white/20 hover:opacity-90 text-white dark:text-white font-medium shadow transition">
          Find a Ride
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useLocationStore } from '@/stores/location'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const location = useLocationStore()
const router = useRouter()

import { useDarkMode } from '@/composables/useDarkMode'
const { isDark, toggleDark } = useDarkMode()


/*const isDark = ref(false)
const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
} */

const handleLocationChanged = (e) => {
  location.$patch({
    destination: {
      name: e.name,
      address: e.formatted_address,
      geometry: {
        lat: e.geometry.location.lat(),
        lng: e.geometry.location.lng()
      }
    }
  })
}

const handleSelectLocation = () => {
  if (location.destination.name !== '') {
    router.push({ name: 'map' })
  }
}
</script>

<style>
html {
  transition: background-color 0.3s ease;
}
</style>
