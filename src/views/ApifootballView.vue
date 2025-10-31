<script setup>
import { ref, onMounted } from 'vue'
import { mockFixtures } from '../mockFixtures.js'

const fixtures = ref([])
const loading = ref(true)

const fetchFixtures = async () => {
  loading.value = true
  try {
    const todayStr = new Date().toISOString().slice(0, 10)
    let json = null
    try {
      const res = await fetch(
        `https://soccer.sportmonks.com/api/v3/football/fixtures?leagues=271&date=${todayStr}&api_token=${import.meta.env.VITE_SPORTMONKS_TOKEN}`
      )
      if (res.ok) json = await res.json()
    } catch {}

    if (json?.data?.length > 0) {
      fixtures.value = json.data.concat(mockFixtures)
    } else {
      fixtures.value = mockFixtures
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchFixtures)
</script>

<template>
  <div>
    <div v-for="match in fixtures" :key="match.id">
      {{ match.localteam.name }} vs {{ match.visitorteam.name }} at {{ match.time.starting_at }}
    </div>
  </div>
</template>
