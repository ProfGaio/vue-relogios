import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegistrarView from '@/views/RegistrarView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      
      component: AboutView
    },
    {
      path:'/login',
      name:'login',
      component: LoginView
    },
    {
      path:'/registrar',
      name:'registrar',
      component: RegistrarView
    }
  ]
})

export default router
