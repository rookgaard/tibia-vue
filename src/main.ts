import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-3-socket.io'

const socket = new VueSocketIO({
	debug: false,
	connection: process.env.VUE_APP_PROXY_URL,
});

createApp(App).use(router).use(socket).mount('#app');
