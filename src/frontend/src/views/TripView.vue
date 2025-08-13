<template>
  <div :class="['min-h-screen flex items-center justify-center transition-colors duration-300 px-4 relative', isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]']">

    <!-- Dark Mode Toggle -->
    <button @click="toggleDark"
      class="absolute top-5 right-5 bg-black/10 text-black dark:text-white px-3 py-1 rounded-full backdrop-blur border border-black/10 dark:border-white/20 text-sm shadow-md z-10">
      {{ isDark ? '☀️ Light' : '🌙 Dark' }}
    </button>

    <!-- Background Circles -->
    <div class="absolute w-80 h-80 bg-purple-300 opacity-30 rounded-full blur-3xl -top-40 -left-40"></div>
    <div class="absolute w-96 h-96 bg-orange-300 opacity-20 rounded-full blur-3xl -bottom-40 -right-40"></div>

    <!-- Main Card -->
    <div class="w-full max-w-md p-6 backdrop-blur-lg bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/20 rounded-2xl shadow-xl text-black dark:text-white text-center relative z-10">
      <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>

      <div class="overflow-hidden rounded-xl mb-4">
        <GMapMap :zoom="14" :center="location.current.geometry" ref="gMap" style="width:100%; height: 256px;">
          <GMapMarker :position="location.current.geometry" :icon="currentIcon" />
          <GMapMarker v-if="trip.driver_location" :position="trip.driver_location" :icon="driverIcon" />
        </GMapMap>
      </div>

      <p class="text-sm opacity-80 mb-6">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { useLocationStore } from '@/stores/location'
import { useTripStore } from '@/stores/trip'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

const location = useLocationStore()
const trip = useTripStore()
const router = useRouter()

const title = ref('Waiting for a driver to accept your request...')
const message = ref('When a driver accepts the trip, their info will appear here.')

const gMap = ref(null)
const gMapObject = ref(null)

/*const isDark = ref(false)
const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
} */

import { useDarkMode } from '@/composables/useDarkMode'
const { isDark, toggleDark } = useDarkMode()


const currentIcon = {
  url: 'https://openmoji.org/data/color/svg/1F920.svg',
  scaledSize: { width: 24, height: 24 }
}

const driverIcon = {
  url: 'https://openmoji.org/data/color/svg/1F698.svg',
  scaledSize: { width: 32, height: 32 }
}

const updateMapBounds = () => {
  if (!trip.driver_location) return

  const origin = new google.maps.LatLng(location.current.geometry)
  const driver = new google.maps.LatLng(trip.driver_location)

  const bounds = new google.maps.LatLngBounds()
  bounds.extend(origin)
  bounds.extend(driver)

  gMapObject.value.fitBounds(bounds)
}

onMounted(() => {
  gMap.value.$mapPromise.then((mapObject) => {
    gMapObject.value = mapObject
  })

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

  echo.channel(`passenger_${trip.user_id}`)
    .listen('TripAccepted', (e) => {
      trip.$patch(e.trip)
      title.value = "A driver is on the way!"
      message.value = `${e.trip.driver.user.name} is coming in a ${e.trip.driver.year} ${e.trip.driver.color} ${e.trip.driver.make} ${e.trip.driver.model} (Plate: ${e.trip.driver.license_plate})`
    })
    .listen('TripLocationUpdated', (e) => {
      trip.$patch(e.trip)
      setTimeout(updateMapBounds, 1000)
    })
    .listen('TripStarted', (e) => {
      trip.$patch(e.trip)
      location.$patch({ current: { geometry: e.trip.destination } })
      title.value = "You're on your way!"
      message.value = `Heading to ${e.trip.destination_name}`
    })
    .listen('TripEnded', (e) => {
      trip.$patch(e.trip)
      title.value = "You've arrived!"
      message.value = `Hope you enjoyed your ride with ${e.trip.driver.user.name}`

      setTimeout(() => {
        trip.reset()
        location.reset()
        router.push({ name: 'landing' })
      }, 10000)
    })
})
</script>
