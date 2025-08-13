<template>
  <div :class="['min-h-screen flex items-center justify-center transition-colors duration-300 px-4 relative', isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]']">

    <!-- Dark Mode Toggle -->
    <button @click="toggleDark"
      class="absolute top-5 right-5 bg-black/10 text-black dark:text-white px-3 py-1 rounded-full backdrop-blur border border-black/10 dark:border-white/20 text-sm shadow-md z-10">
      {{ isDark ? '☀️ Light' : '🌙 Dark' }}
    </button>

    <!-- Back Button -->
    <button @click="goBack"
      class="absolute top-5 left-5 bg-black/10 text-black dark:text-white px-3 py-1 rounded-full backdrop-blur border border-black/10 dark:border-white/20 text-sm shadow-md z-10">
      ← Back
    </button>

    <!-- Background Shapes -->
    <div class="absolute w-80 h-80 bg-purple-300 opacity-30 rounded-full blur-3xl -top-40 -left-40"></div>
    <div class="absolute w-96 h-96 bg-orange-300 opacity-20 rounded-full blur-3xl -bottom-40 -right-40"></div>

    <!-- Main Glass Box -->
    <div class="w-full max-w-md p-6 backdrop-blur-lg bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/20 rounded-2xl shadow-xl text-black dark:text-white relative z-10">
      <h1 class="text-2xl font-bold mb-2 text-center">{{ title }}</h1>
      <p class="text-sm opacity-80 text-center mb-6">Please wait while someone requests a ride…</p>

      <!-- Searching Animation -->
      <div v-if="!trip.id" class="flex justify-center mb-6">
        <div class="search-loader">
          <svg viewBox="0 0 512 512" class="magnifier">
            <path fill="currentColor"
              d="M505 442.7L405.3 343c28.3-34.9 45.2-79 45.2-127C450.5 96.5 354 0 232.5 0S14.5 96.5 14.5 216s96.5 216 216 216c48 0 92.1-16.9 127-45.2l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l14.1-14.1c9.5-9.4 9.5-24.6.1-34zM232.5 384c-92.8 0-168-75.2-168-168S139.7 48 232.5 48s168 75.2 168 168-75.2 168-168 168z" />
          </svg>
        </div>
      </div>

      <!-- Show trip info -->
      <div v-else>
        <GMapMap :zoom="14" :center="trip.destination" ref="gMap" style="width: 100%; height: 256px;" />
        <div class="mt-3 text-center">
          <p class="text-base sm:text-lg">Going to <strong>{{ trip.destination_name }}</strong></p>
        </div>
        <div class="flex justify-between mt-6">
          <button
            @click="handleDeclineTrip"
            class="w-[48%] py-2 px-4 rounded-md bg-red-600/90 dark:bg-red-700/60 text-white font-medium shadow hover:opacity-90 transition">
            Decline
          </button>
          <button
            @click="handleAcceptTrip"
            class="w-[48%] py-2 px-4 rounded-md bg-black/80 dark:bg-white/20 text-white font-medium shadow hover:opacity-90 transition">
            Accept
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { useTripStore } from '@/stores/trip'
import { useLocationStore } from '@/stores/location'
import http from '@/helpers/http'
import { useRouter } from 'vue-router'

const title = ref('Waiting for requests...')
const gMap = ref(null)
const trip = useTripStore()
const location = useLocationStore()
const router = useRouter()
//const isDark = ref(false)

import { useDarkMode } from '@/composables/useDarkMode'
const { isDark, toggleDark } = useDarkMode()


/*const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
} */

const goBack = () => {
  router.push({ name: 'landing' })
}

const handleDeclineTrip = () => {
  trip.reset()
  title.value = 'Waiting for requests...'
}

const handleAcceptTrip = () => {
  http().post(`/api/trip/${trip.id}/accept`, {
    driver_location: location.current.geometry
  })
    .then((response) => {
      location.$patch({
        destination: {
          name: 'Passenger',
          geometry: response.data.origin
        }
      })
      router.push({ name: 'driving' })
    })
    .catch((error) => {
      console.error(error)
    })
}

onMounted(async () => {
  await location.updateCurrentLocation()

  const echo = new Echo({
    broadcaster: 'pusher',
    key: 'mykey',
    cluster: 'mt1',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss']
  })

  echo.channel('drivers')
    .listen('TripCreated', (e) => {
      title.value = 'Ride requested:'
      trip.$patch(e.trip)
      setTimeout(initMapDirections, 2000)
    })
})

const initMapDirections = () => {
  gMap.value.$mapPromise.then((mapObject) => {
    const originPoint = new google.maps.LatLng(trip.origin)
    const destinationPoint = new google.maps.LatLng(trip.destination)

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer({ map: mapObject })

    directionsService.route({
      origin: originPoint,
      destination: destinationPoint,
      avoidTolls: false,
      avoidHighways: false,
      travelMode: google.maps.TravelMode.DRIVING
    }, (res, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(res)
      } else {
        console.error(status)
      }
    })
  })
}
</script>

<style scoped>
html {
  transition: background-color 0.3s ease;
}

/* Searching magnifier animation */
.search-loader {
  width: 64px;
  height: 64px;
  color: black;
  animation: rotate 2s linear infinite;
}
.dark .search-loader {
  color: white;
}
.magnifier {
  width: 100%;
  height: 100%;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
