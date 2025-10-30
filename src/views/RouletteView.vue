<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '@/firebase.js'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const startBalance = 1000
const pityMoney = 1000
const currentBalance = ref(0)
const userId = ref(null)
const busy = ref(false)
const message = ref('')
const apiMatches = ref([])
const loadingMatches = ref(true)
const errorMessage = ref('')

// --- Firebase ---
const loadUserBalance = async (uid) => {
  const userRef = doc(db, 'users', uid)
  const docSnap = await getDoc(userRef)
  if (docSnap.exists()) {
    currentBalance.value = docSnap.data().currentBalance
  } else {
    await setDoc(userRef, { startBalance, currentBalance: startBalance, history: [] })
    currentBalance.value = startBalance
  }
}

const updateBalance = async (amountChange) => {
  if (!userId.value) return
  const userRef = doc(db, 'users', userId.value)
  currentBalance.value += amountChange
  await updateDoc(userRef, { currentBalance: currentBalance.value })
}

const addPityMoney = async () => {
  if (!userId.value) return
  currentBalance.value += pityMoney
  await updateDoc(doc(db, 'users', userId.value), { currentBalance: currentBalance.value })
}

// --- Auth ---
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid
      await loadUserBalance(user.uid)
    } else {
      const result = await signInAnonymously(auth)
      userId.value = result.user.uid
      await loadUserBalance(result.user.uid)
    }
  })
})

// --- RNG ---
const oddsFor = (choice) => (choice === 'draw' ? 5.0 : 2.0)
const simulateResult = () => {
  const rand = Math.random()
  if (rand < 0.45) return 'home'
  if (rand < 0.9) return 'away'
  return 'draw'
}
const resultText = (r, teamA, teamB) => {
  if (r === 'home') return `${teamA} won`
  if (r === 'away') return `${teamB} won`
  return 'Draw'
}

// --- Betting ---
const placeBet = async (match) => {
  if (busy.value) return
  const amt = Number(match.betAmount)
  if (!amt || amt <= 0) {
    match.message = 'Enter a valid bet amount.'
    return
  }
  if (amt > currentBalance.value) {
    match.message = 'Insufficient balance.'
    return
  }

  busy.value = true
  match.message = 'Placing bet...'
  await new Promise((r) => setTimeout(r, 600))

  const result = simulateResult()
  const odds = oddsFor(match.selected)
  let payout = 0
  let netChange = 0
  let won = false

  if (match.selected === result) {
    payout = Math.round(amt * odds * 100) / 100
    netChange = Math.round((payout - amt) * 100) / 100
    won = true
    match.message = `Result: ${resultText(result, match.teamA, match.teamB)} — You won ${payout.toFixed(2)}!`
  } else {
    netChange = -amt
    match.message = `Result: ${resultText(result, match.teamA, match.teamB)} — You lost ${amt.toFixed(2)}.`
  }

  await updateBalance(netChange)

  const userRef = doc(db, 'users', userId.value)
  const docSnap = await getDoc(userRef)
  const currentHistory = docSnap.exists() ? docSnap.data().history || [] : []
  currentHistory.unshift({
    time: new Date().toLocaleTimeString(),
    match: `${match.teamA} vs ${match.teamB}`,
    choice: match.selected,
    amount: amt,
    result,
    won,
    payout,
    balanceAfter: currentBalance.value
  })
  await updateDoc(userRef, { history: currentHistory })
  busy.value = false
}

// --- Fetch fixtures from backend ---
const fetchMatches = async () => {
  loadingMatches.value = true
  errorMessage.value = ''
  try {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseURL}/api/fixtures`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()

    if (json.data?.length > 0) {
      apiMatches.value = json.data.map(f => ({
        teamA: f.localteam?.name || f.localteam_id,
        teamB: f.visitorteam?.name || f.visitorteam_id,
        selected: 'home',
        betAmount: 50,
        message: ''
      }))
    } else {
      errorMessage.value = 'No matches available.'
    }
  } catch (err) {
    console.error('Failed to fetch matches', err)
    errorMessage.value = 'Error loading matches.'
  } finally {
    loadingMatches.value = false
  }
}

onMounted(fetchMatches)
</script>

<template>
  <div class="relative min-h-screen">
    <div class="fixed left-4 top-1/4 w-48 p-4 bg-gray-300 rounded-lg z-50">
      <h2 class="text-lg font-bold mb-2">Balance</h2>
      <p class="text-green-500 font-bold text-xl">{{ currentBalance.toFixed(2) }}</p>
      <button @click="addPityMoney" class="mt-4 w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Pity Money
      </button>
    </div>

    <div class="flex justify-center p-6">
      <div class="w-full max-w-xl">
        <div v-if="loadingMatches" class="text-center text-gray-500 py-10">Loading matches...</div>
        <div v-else-if="errorMessage" class="text-center text-red-600 py-10">{{ errorMessage }}</div>
        <div v-else>
          <div v-for="match in apiMatches" :key="match.teamA + match.teamB" class="bg-white p-4 rounded-lg shadow mb-4">
            <h3 class="text-lg font-semibold mb-2">{{ match.teamA }} vs {{ match.teamB }}</h3>
            <div class="flex gap-4 mb-3">
              <label><input type="radio" value="home" v-model="match.selected" /> {{ match.teamA }} ({{ oddsFor('home') }})</label>
              <label><input type="radio" value="draw" v-model="match.selected" /> Draw ({{ oddsFor('draw') }})</label>
              <label><input type="radio" value="away" v-model="match.selected" /> {{ match.teamB }} ({{ oddsFor('away') }})</label>
            </div>
            <div class="flex gap-2 items-center mb-2">
              <input type="number" min="1" v-model="match.betAmount" class="w-24 px-2 py-1 border rounded" />
              <button @click="placeBet(match)" :disabled="busy" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                {{ busy ? 'Betting...' : 'Place Bet' }}
              </button>
            </div>
            <div class="text-gray-700 mb-2"><strong>Status:</strong> {{ match.message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  outline: none;
}
</style>
