import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './components/login/LoginView.vue'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView
		}
	]
})

export default router
