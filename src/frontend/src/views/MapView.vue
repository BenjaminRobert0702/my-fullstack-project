<template>
  <div :class="['min-h-screen flex items-center justify-center transition-colors duration-300 px-4 relative', isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]']">
    
    <!-- Dark Mode Toggle -->
    <button @click="toggleDark" class="absolute top-5 right-5 bg-black/10 text-black dark:text-white px-3 py-1 rounded-full backdrop-blur border border-black/10 dark:border-white/20 text-sm shadow-md z-10">
      {{ isDark ? '☀️ Light' : '🌙 Dark' }}
    </button>

    <!-- Back Button -->
    <button @click="router.push({ name: 'location' })" class="absolute top-5 left-5 bg-black/10 text-black dark:text-white px-3 py-1 rounded-full backdrop-blur border border-black/10 dark:border-white/20 text-sm shadow-md z-10">
      ← Back
    </button>

    <!-- Background Blobs -->
    <div class="absolute w-80 h-80 bg-purple-300 opacity-30 rounded-full blur-3xl -top-40 -left-40"></div>
    <div class="absolute w-96 h-96 bg-orange-300 opacity-20 rounded-full blur-3xl -bottom-40 -right-40"></div>

    <!-- Main Card -->
    <div class="w-full max-w-md p-6 backdrop-blur-lg bg-white/60 dark:bg-white/10 border border-black/10 dark:border-white/20 rounded-2xl shadow-xl text-black dark:text-white relative z-10">
      <h1 class="text-2xl font-bold mb-4 text-center">Buckle Up</h1>

      <div>
        <GMapMap
          v-if="location.destination.name !== ''"
          :zoom="11"
          :center="location.destination.geometry"
          ref="gMap"
          style="width: 100%; height: 256px"
        ></GMapMap>

        <div class="mt-4 space-y-1 text-sm sm:text-base text-center">
          <p>Going to <strong>{{ location.destination.name }}</strong></p>
          <p v-if="location.distance">Distance: <strong>{{ location.distance }}</strong></p>
          <p v-if="location.duration">Duration: <strong>{{ location.duration }}</strong></p>
          <p v-if="location.fare">Estimated Fare: <strong>₹{{ location.fare }}</strong></p>
        </div>
      </div>

      <button
        @click="handleConfirmTrip"
        class="w-full mt-6 py-2 px-4 rounded-md bg-black/80 dark:bg-white/20 hover:opacity-90 text-white dark:text-white font-medium shadow transition">
        Let's Go!
      </button>
    </div>
  </div>
</template>

<script setup>
import { useLocationStore } from '@/stores/location'
import { useTripStore } from '@/stores/trip'
import http from '@/helpers/http'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const location = useLocationStore()
const trip = useTripStore()
const router = useRouter()
const gMap = ref(null)

import { useDarkMode } from '@/composables/useDarkMode'
const { isDark, toggleDark } = useDarkMode()

/*const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
} */

const handleConfirmTrip = () => {
  http().post('/api/trip', {
    origin: location.current.geometry,
    destination: location.destination.geometry,
    destination_name: location.destination.name
  }).then((response) => {
    trip.$patch(response.data)
    router.push({ name: 'trip' })
  }).catch((error) => {
    console.error(error)
  })
}

onMounted(async () => {
  if (location.destination.name === '') {
    router.push({ name: 'location' })
  }

  await location.updateCurrentLocation()

  gMap.value.$mapPromise.then((mapObject) => {
    const currentPoint = new google.maps.LatLng(location.current.geometry)
    const destinationPoint = new google.maps.LatLng(location.destination.geometry)

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer({ map: mapObject })

    directionsService.route({
      origin: currentPoint,
      destination: destinationPoint,
      avoidTolls: false,
      avoidHighways: false,
      travelMode: google.maps.TravelMode.DRIVING
    }, (res, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(res)

        const leg = res.routes[0].legs[0]
        location.distance = leg.distance.text
        location.duration = leg.duration.text

        const distanceInKm = leg.distance.value / 1000
        const baseFare = 20
        const perKmRate = 7
        location.fare = Math.round(baseFare + (perKmRate * distanceInKm))
      } else {
        console.error(status)
      }
    })
  })
})
</script>

<style scoped>
html {
  transition: background-color 0.3s ease;
}
</style>
