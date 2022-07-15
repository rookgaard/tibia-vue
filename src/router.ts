import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './components/login/LoginView.vue'
import AboutView from './views/AboutView.vue'

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
		},
		{
			path: '/about',
			name: 'about',
			component: AboutView
		}
	]
})

export default router
