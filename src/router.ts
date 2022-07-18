import {createRouter, createWebHashHistory} from 'vue-router'
import {HomeView, LoginView, SocketComponent, GameView} from '@/components'

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
		},
		{
			path: '/game',
			name: 'game',
			component: GameView
		}
	]
})

export default router
