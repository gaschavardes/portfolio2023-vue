import { ClampToEdgeWrapping, Clock, LinearFilter, LinearMipmapLinearFilter, Texture, WebGLRenderer, LinearSRGBColorSpace, LinearToneMapping  } from 'three'
import { setupShaderChunks } from './materials'
import store from './store'
import { E, qs, ArrayOrderController, SceneTransition} from './utils'
import GlobalEvents from './utils/GlobalEvents'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"

export default class WebGL {
	constructor() {
		this.dom = {
			canvas: qs('canvas#gl')
		}


		this.setup()

		this.composer = new EffectComposer(this.renderer)
		this.composerPasses = new ArrayOrderController(this.composer.passes)

		this.SceneTransition = new SceneTransition({ fromScene: 'MainScene', toScene: 'LabScene', index: 50, duration: 3 })

		this.scenes = {
			/** @type { import("./scenes/MainScene").default } */
			MainScene: store.MainScene,
			/** @type { import("./scenes/LabScene").default } */
			LabScene: store.LabScene,
		}

		E.on('App:start', this.start)
	}

	setup() {
		this.renderer = new WebGLRenderer({ alpha: false, antialias: true, canvas: this.dom.canvas, powerPreference: 'high-performance', stencil: false })
		this.renderer.setPixelRatio(store.window.dpr >= 2 ? 2 : store.window.dpr)
		this.renderer.setSize(store.window.w, store.window.h)
		this.renderer.toneMapping = LinearToneMapping 
		this.renderer.outputColorSpace = LinearSRGBColorSpace;

		this.renderer.toneMappingExposure = 1
		this.clock = new Clock()

		this.globalUniforms = {
			uDelta: { value: 0 },
			uTime: { value: 0 }
		}

		setupShaderChunks()
	}

	start = () => {
		this.addEvents()
	}

	addEvents() {
		E.on(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.add(this.onRaf, 1)
		E.on('sceneChange', (e) => {
			this.SceneTransition.transition(e.value === 'Lab' ? 1 : 0)
		})
	}

	buildPasses() {
		// this.lensEffect.build()
		this.scenes.MainScene = store.MainScene
		this.scenes.LabScene = store.LabScene
		this.SceneTransition.build()
	}

	onRaf = (time) => {
		this.clockDelta = this.clock.getDelta()
		this.globalUniforms.uDelta.value = this.clockDelta > 0.016 ? 0.016 : this.clockDelta
		this.globalUniforms.uTime.value = time
		this.composer.render()
	}

	onResize = () => {
		this.renderer.setSize(store.window.w, store.window.h)
		this.composer.setSize(store.window.w, store.window.h)
	}

	generateTexture(texture, options = {}, isKtx = false) {
		if (texture instanceof HTMLImageElement) {
			texture = new Texture(texture)
		}
		texture.minFilter = options.minFilter || (isKtx ? LinearFilter : LinearMipmapLinearFilter)
		texture.magFilter = options.magFilter || LinearFilter
		texture.wrapS = texture.wrapT = options.wrapping || ClampToEdgeWrapping
		texture.flipY = options.flipY !== undefined ? options.flipY : true
		// texture.encoding = options.colorSpace || LinearEncoding
		this.renderer.initTexture(texture)
		return texture
	}
}