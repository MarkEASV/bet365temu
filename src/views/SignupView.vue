<script setup>
import { ref } from 'vue'   
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const signup = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
       console.log('User signed up:', data.user) 
      router.push('/roulette')
    })
    .catch((error) => {

      console.error('Error signing up')
      alert(error.message)
    })
   
}

</script>

<template>
    <h1 class="text-2xl">Create an account</h1>
  <p><input type="text" placeholder="Email" v-model="email" 
    class="border border-gray-800 rounded px-2 py-1 mb-2"
    /></p>
  <p><input type="password" placeholder="Password" v-model="password" 
    class="border border-gray-800 rounded px-2 py-1 mb-4"
    /></p>
  <button @click="signup"
  class="px-6 py-2 rounded-full border bg-green-800 border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition"
  >Sign up</button>
</template>

<style>

</style>