import {createRouter, createWebHashHistory} from 'vue-router'
import {HomeView, LoginView, GameView} from '@/components'

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
			path: '/game',
			name: 'game',
			component: GameView
		}
	]
})

export default router
