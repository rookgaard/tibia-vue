import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-3-socket.io'

const socket = new VueSocketIO({
	debug: false,
	connection: "http://10.254.0.174:3006",
});

createApp(App).use(router).use(socket).mount('#app');
