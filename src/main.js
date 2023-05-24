import { createApp } from 'vue'
import App from './App.vue'
import MainScene from './assets/js/scenes/MainScene'
import store from './assets/js/store'
import { AssetLoader, E, RAFCollection } from './assets/js/utils'
import GlobalEvents from './assets/js/utils/GlobalEvents'
import WebGL from './assets/js/WebGL'

createApp(App).mount('#app')


store.RAFCollection = new RAFCollection()
store.AssetLoader = new AssetLoader()

window.urlParams = new URLSearchParams(window.location.search)

store.WebGL = new WebGL()
store.MainScene = new MainScene()

GlobalEvents.detectTouchDevice()
GlobalEvents.enableRAF(true)
GlobalEvents.enableResize()
GlobalEvents.enableMousemove()

window.store = store

store.AssetLoader.load().then(() => {
	E.emit('App:start')

	if (new URLSearchParams(window.location.search).has('gui')) {
		import('./assets/js/utils/Gui').then(({ Gui }) => {
			store.Gui = new Gui()
		})
	}
})