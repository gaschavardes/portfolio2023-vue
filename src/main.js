import { createApp } from 'vue'
import App from './App.vue'
import MainScene from './assets/js/scenes/MainScene'
import store from './assets/js/store'
import { AssetLoader, E, RAFCollection } from './assets/js/utils'
import GlobalEvents from './assets/js/utils/GlobalEvents'
import WebGL from './assets/js/WebGL'
import { createRouter, createWebHistory} from 'vue-router'

import Home from '../src/pages/home'
import Lab from '../src/pages//lab'
import LabScene from './assets/js/scenes/LabScene'

const routes = [
	{
		path: '/',
		component: Home,
		name: 'Home',
		meta: { transition: 'fade'}
	},
	{
		path: '/lab',
		component: Lab,
		name: 'Lab',
		meta: { transition: 'fade'}
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
	// scrollBehavior(to, from, savedPosition) {
	// 	// always scroll to top
	// 	return { top: 0 }
	// }
})

createApp(App).use(router).mount('#app')


store.RAFCollection = new RAFCollection()
store.AssetLoader = new AssetLoader()

window.urlParams = new URLSearchParams(window.location.search)

store.WebGL = new WebGL()
store.MainScene = new MainScene()
store.LabScene = new LabScene()

GlobalEvents.detectTouchDevice()
GlobalEvents.enableRAF(true)
GlobalEvents.enableResize()
GlobalEvents.enableMousemove()

window.store = store

store.AssetLoader.load().then(() => {
	E.emit('App:start')
	store.WebGL.buildPasses()

	if (new URLSearchParams(window.location.search).has('gui')) {
		import('./assets/js/utils/Gui').then(({ Gui }) => {
			store.Gui = new Gui()
		})
	}
})