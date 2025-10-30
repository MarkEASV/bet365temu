<script setup>
import { ref } from 'vue'   
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
  const cleanEmail = email.value.trim().toLowerCase()

  signInWithEmailAndPassword(getAuth(), cleanEmail, password.value)
    .then((data) => {
      console.log('Logged in:', data.user)
      router.push('/roulette')
    })
    .catch((error) => {
      console.error('Error logging in:', error)
      alert(error.message)
    })
}
</script>

<template>
  <h1 class="text-2xl">Login</h1>
  <p><input type="text" placeholder="Email" v-model="email" 
    class="border border-gray-800 rounded px-2 py-1 mb-2"
    /></p>
  <p><input type="password" placeholder="Password" v-model="password" 
    class="border border-gray-800 rounded px-2 py-1 mb-4"
    /></p>
  <button @click="login"
  class="px-6 py-2 rounded-full border bg-blue-800 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition"
  >Login</button>
</template>

<style>

</style>
