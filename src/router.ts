import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from './components/HomeView.vue'
import LoginView from './components/login/LoginView.vue'
import SocketComponent from './components/SocketComponent.vue'

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
			path: '/socket',
			name: 'socket',
			component: SocketComponent
		}
	]
})

export default router
