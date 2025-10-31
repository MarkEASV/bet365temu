<script setup>
import { ref, onMounted } from 'vue'
import { mockFixtures } from '../mockFixtures.js'

const fixtures = ref([])
const loading = ref(true)
const error = ref(null)
const todayStr = new Date().toISOString().slice(0, 10)

const formatDate = (date) => date.toISOString().slice(0, 10)

const fetchFixtures = async () => {
  loading.value = true
  error.value = null
  let foundFixtures = false

  try {
    for (let i = -7; i <= 7; i++) {
      const date = formatDate(new Date(Date.now() + i * 24 * 60 * 60 * 1000))
      let json = null

      try {
        const res = await fetch(
          `https://soccer.sportmonks.com/api/v3/football/fixtures?leagues=271&date=${date}&api_token=${import.meta.env.VITE_SPORTMONKS_TOKEN}`
        )
        if (res.ok) {
          json = await res.json()
        }
      } catch {}

      if (json?.data?.length > 0) {
        fixtures.value = json.data
        foundFixtures = true
        break
      }
    }

    if (!foundFixtures) {
      fixtures.value = mockFixtures
    }
  } catch {
    fixtures.value = mockFixtures
    error.value = 'Failed to load Sportmonks API. Using mock fixtures.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchFixtures)
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Superliga Fixtures</h1>
    <p class="mb-4">prøvede at implementere APi fra sportsmonk men virkede kun lokal, da man skulle betale sig ud af det<br> ps. en mådede kostede 39pund</br></p>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-600 mb-4">{{ error }}</div>
    <div v-else-if="fixtures.length === 0">Ingen kampe tilgængelige de sidste 7 dage og næste 7 dage.</div>
    <div v-else>
      <div
        v-for="match in fixtures"
        :key="match.id"
        class="p-4 mb-3 border rounded-lg bg-white"
      >
        <div class="font-semibold text-lg mb-1">
          {{ match.localteam?.name || match.localteam_id }} vs
          {{ match.visitorteam?.name || match.visitorteam_id }}
        </div>
        <div class="text-sm text-gray-600">
          {{ match.time?.starting_at
            ? new Date(match.time.starting_at).toLocaleString()
            : 'TBD' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
