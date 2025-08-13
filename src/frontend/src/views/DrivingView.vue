<template>
  <div :class="['min-h-screen flex items-center justify-center transition-colors duration-300 px-4 relative', isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]']">

    <!-- Dark Mode Toggle -->
    <button @click="toggleDark"
      class="absolute top-5 right-5 bg-black/10 text-black dark:text-white px-3 py-1 rounded-full backdrop-blur border border-black/10 dark:border-white/20 text-sm shadow-md z-10">
      {{ isDark ? '☀️ Light' : '🌙 Dark' }}
    </button>

    <!-- Decorative Background -->
    <div class="absolute w-80 h-80 bg-purple-300 opacity-30 rounded-full blur-3xl -top-40 -left-40"></div>
    <div class="absolute w-96 h-96 bg-orange-300 opacity-20 rounded-full blur-3xl -bottom-40 -right-40"></div>

    <!-- Main Card -->
    <div class="w-full max-w-md p-6 backdrop-blur-lg bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/20 rounded-2xl shadow-xl text-black dark:text-white text-center relative z-10">
      <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>

      <!-- Trip Info Section -->
      <div v-if="!trip.is_complete">
        <div class="overflow-hidden rounded-xl mb-4">
          <GMapMap :zoom="14" :center="location.current.geometry" ref="gMap" style="width:100%; height: 256px;">
            <GMapMarker :position="location.current.geometry" :icon="currentIcon" />
            <GMapMarker :position="location.destination.geometry" :icon="destinationIcon" />
          </GMapMap>
        </div>
        <p class="text-base mb-6">Going to <strong>pick up a passenger</strong></p>

        <div class="flex justify-center gap-4">
          <button
            v-if="trip.is_started"
            @click="handleCompleteTrip"
            class="py-2 px-4 rounded-md bg-black dark:bg-white/20 text-white dark:text-white font-medium shadow hover:opacity-90 transition">
            Complete Trip
          </button>
          <button
            v-else
            @click="handlePassengerPickedUp"
            class="py-2 px-4 rounded-md bg-black dark:bg-white/20 text-white dark:text-white font-medium shadow hover:opacity-90 transition">
            Passenger Picked Up
          </button>
        </div>
      </div>

      <!-- After Trip Completion -->
      <div v-else class="mt-6">
        <Tada />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocationStore } from '@/stores/location'
import { useTripStore } from '@/stores/trip'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import http from '@/helpers/http'
import Tada from '@/components/Tada.vue'

const location = useLocationStore()
const trip = useTripStore()
const router = useRouter()

const gMap = ref(null)
const intervalRef = ref(null)
//const isDark = ref(false)

const title = ref('Driving to passenger...')

import { useDarkMode } from '@/composables/useDarkMode'
const { isDark, toggleDark } = useDarkMode()

/*const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
} */

const currentIcon = {
  url: 'https://openmoji.org/data/color/svg/1F698.svg',
  scaledSize: { width: 32, height: 32 }
}

const destinationIcon = {
  url: 'https://openmoji.org/data/color/svg/1F920.svg',
  scaledSize: { width: 24, height: 24 }
}

const updateMapBounds = (mapObject) => {
  let originPoint = new google.maps.LatLng(location.current.geometry),
    destinationPoint = new google.maps.LatLng(location.destination.geometry),
    latLngBounds = new google.maps.LatLngBounds()

  latLngBounds.extend(originPoint)
  latLngBounds.extend(destinationPoint)

  mapObject.fitBounds(latLngBounds)
}

const broadcastDriverLocation = () => {
  http().post(`/api/trip/${trip.id}/location`, {
    driver_location: location.current.geometry
  }).catch(console.error)
}

const handlePassengerPickedUp = () => {
  http().post(`/api/trip/${trip.id}/start`)
    .then((response) => {
      title.value = 'Travelling to destination...'
      location.$patch({
        destination: {
          name: response.data.destination_name,
          geometry: response.data.destination
        }
      })
      trip.$patch(response.data)
    })
    .catch(console.error)
}

const handleCompleteTrip = () => {
  http().post(`/api/trip/${trip.id}/end`)
    .then((response) => {
      title.value = 'Trip completed!'
      trip.$patch(response.data)
      setTimeout(() => {
        trip.reset()
        location.reset()
        router.push({ name: 'standby' })
      }, 3000)
    })
    .catch(console.error)
}

onMounted(() => {
  gMap.value.$mapPromise.then((mapObject) => {
    updateMapBounds(mapObject)
    intervalRef.value = setInterval(async () => {
      await location.updateCurrentLocation()
      broadcastDriverLocation()
      updateMapBounds(mapObject)
    }, 5000)
  })
})

onUnmounted(() => {
  clearInterval(intervalRef.value)
  intervalRef.value = null
})
</script>
