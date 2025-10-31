<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { auth } from './firebase.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import router from './router'

const isLoggedIn = ref(false)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      console.log('User is logged in:', user.email || user.uid)
    } else {
      isLoggedIn.value = false
      console.log('No user is logged in')
    }
  })
})

const handlesignout = () => {
  signOut(auth)
    .then(() => {
      router.push('/')
      console.log('User signed out')
    })
    .catch((error) => {
      console.error('Error signing out:', error)
    })
}
</script>

<template>
  <nav class="bg-gray-700 p-4 flex items-center justify-evenly">
    <RouterLink to="/">
      <img src="./img/Combo.png" alt="Logo" class="h-16" />
    </RouterLink>

    <div class="flex h-full items-center">
      <RouterLink v-if="isLoggedIn" to="/roulette" class="p-2 mr-2 text-white outline rounded-2xl hover:underline">
        Gamble
      </RouterLink>
      
      <RouterLink v-if="isLoggedIn" to="/history" class="p-2 mr-2 text-white outline rounded-2xl hover:underline">
        Bet history
      </RouterLink>

      <RouterLink v-if="isLoggedIn" to="/apifootball" class="p-2 text-white outline rounded-2xl hover:underline">
        API testing
      </RouterLink>
    </div>

    <div class="flex gap-4 font-bold text-lg">
      <RouterLink
        v-if="!isLoggedIn"
        to="/login"
        class="px-6 py-2 rounded-full border border-green-400 text-white hover:bg-green-400 hover:text-green-900 transition"
      >
        login
      </RouterLink>

      <RouterLink
        v-if="!isLoggedIn"
        to="/signup"
        class="px-6 py-2 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-green-900 transition"
      >
        signup
      </RouterLink>

      <button
        v-if="isLoggedIn"
        @click="handlesignout"
        class="px-6 py-2 rounded-full border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition"
      >
        Logout
      </button>
    </div>
  </nav>

  <main class="bg-gray-100 min-h-screen flex flex-col items-center justify-center w-full">
    <RouterView />
    <h1 v-if="!isLoggedIn && $route.path === '/'">
      Log ind eller opret en profil for at oddse
    </h1>
  </main>
</template>

<style scoped>
</style>
