<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '@/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore' 

const userId = ref(null)
const history = ref([])
const loading = ref(true)
const error = ref(null)
const clearingHistory = ref(false) 

// Load user betting history
const loadHistory = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid)
    const docSnap = await getDoc(userRef)
    if (docSnap.exists()) {
      history.value = (docSnap.data().history || []).filter(h => h.won !== undefined)
    } else {
      history.value = []
    }
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load history.'
  } finally {
    loading.value = false
  }
}

// ✅ Clear betting history function
const clearHistory = async () => {
  if (!userId.value) return
  if (!confirm('Are you sure you want to clear your betting history?')) return

  try {
    clearingHistory.value = true
    const userRef = doc(db, 'users', userId.value)
    await updateDoc(userRef, { history: [] }) // clear Firestore data
    history.value = [] // clear local table
  } catch (err) {
    console.error(err)
    console.log('Failed to clear history')
  } finally {
    clearingHistory.value = false
  }
}

// Auth and load
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
      userId.value = user.uid
      await loadHistory(user.uid)
  })
})
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Betting History</h2>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <table v-if="!loading && history.length > 0" class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-2 py-1 text-left">Time</th>
          <th class="border px-2 py-1 text-left">Match</th>
          <th class="border px-2 py-1">Amount</th>
          <th class="border px-2 py-1">Result</th>
          <th class="border px-2 py-1">Payout</th>
          <th class="border px-2 py-1">Balance After</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(h, i) in history"
          :key="i"
          :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
        >
          <td class="border px-2 py-1 text-sm">{{ h.time }}</td>
          <td class="border px-2 py-1 text-sm">{{ h.match }}</td>
          <td class="border px-2 py-1 text-center">{{ h.amount.toFixed(2) }}</td>
          <td class="border px-2 py-1 text-center">
            <span :class="h.won ? 'text-green-600' : 'text-red-600'">
              {{ h.won ? 'Win' : 'Lose' }}
            </span>
          </td>
          <td class="border px-2 py-1 text-center">{{ h.payout.toFixed(2) }}</td>
          <td class="border px-2 py-1 text-center">{{ h.balanceAfter.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading && history.length === 0" class="text-gray-500">
      No bets yet.
    </div>
  </div>

  <div v-if="!loading && history.length > 0" class="mt-4 text-center">
    <button
      @click="clearHistory"
      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      :disabled="clearingHistory"
    >
      {{ clearingHistory ? 'Clearing...' : 'Clear History' }}
    </button>
  </div>
</template>

<style scoped>
table th,
table td {
  border: 1px solid #e5e7eb;
}
</style>
