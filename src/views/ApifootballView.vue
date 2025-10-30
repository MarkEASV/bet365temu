<script setup>
import { ref, onMounted } from 'vue'

const fixtures = ref([])
const loading = ref(true)
const error = ref(null)

const formatDate = (date) => date.toISOString().slice(0, 10)

// Fetch fixture data
const fetchFixtures = async () => {
  loading.value = true
  error.value = null

  try {
    let foundFixtures = false

    for (let i = -7; i <= 7; i++) { 
      const date = formatDate(new Date(Date.now() + i * 24 * 60 * 60 * 1000))
      const res = await fetch(`http://localhost:3000/api/fixtures?date=${date}`)
      const json = await res.json()

      if (json.data && json.data.length > 0) {
        fixtures.value = json.data
        console.log(`Fundet kampe for ${date}:`, fixtures.value)
        foundFixtures = true
        break
      }
    }

    if (!foundFixtures) {
      fixtures.value = []
      console.log('Ingen kampe fundet de sidste 7 dage og næste 7 dage.')
    }
  } catch (err) {
    console.error('Error fetching fixtures:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchFixtures)
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Superliga Fixtures</h1>
    <p class="mb-4">Har free-subscription hos sportsmonk som kun viser Superliga indenfor -7/+7 fra dagen og holdets id(Ikke holdnavn eller dato) 
      hvis det ikke vises har jeg stillet en mockup, hvis den ikke kan finde kampe fra APi :))
      <br>ps. det kosted 39 pund som standard som giver adgang til meget mere
    </p>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="fixtures.length === 0">Ingen kampe tilgængelige de sidste 7 dage og næste 7 dage.</div>
    <div v-else>
      <div v-for="match in fixtures" :key="match.id" class="p-4 mb-3 border rounded-lg shadow-sm">
        <div class="font-semibold text-lg mb-1">
          {{ match.localteam?.name || match.localteam_id }} vs {{ match.visitorteam?.name || match.visitorteam_id }}
        </div>
        <div class="text-sm text-gray-600">
          {{ match.time?.starting_at ? new Date(match.time.starting_at).toLocaleString() : 'TBD' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
