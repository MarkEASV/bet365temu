import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignupView.vue') 
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue') 
  },
  {
    path: '/roulette',
    name: 'roulette',
    component: () => import('../views/RouletteView.vue') 
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue') 
  },
  {
  path: '/apifootball',
  name: 'apifootball',
  component: () => import('../views/ApifootballView.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
