import { Color, PerspectiveCamera, CameraHelper, OrthographicCamera, Scene, AmbientLight, SpotLight, GridHelper, Vector2, ShaderMaterial} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Background from '../components/Background'
// import Hello from '../components/Hello'
import Letter from '../components/Letter'
import Projects from '../components/Projects'
import store from '../store'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import screenFxVert from '../../../../glsl/includes/screenFx/vert.glsl'
import screenFxFrag from '../../../../glsl/includes/screenFx/frag.glsl'
// import Sim from '../components/Sim'
// import Background from '../components/Background'

export default class MainScene extends Scene {
	constructor() {
		super()

		store.MainScene = this
		this.options = {
			controls: window.urlParams.has('controls')
		}

		this.camera = new PerspectiveCamera(45, store.window.w / store.window.h, 2, 50)
		this.camera.position.z = 15
		this.add(this.camera)


		this.orthoCamera = new OrthographicCamera(
			store.window.w / -2,
			store.window.w / 2,
			store.window.h / 2,
			store.window.h / -2,
			1,
			1000
		)
		this.orthoCamera.position.z = 5
		this.orthoCamera.layers.set(1)

		this.activeCamera = this.camera

		/* Debug tools */
		this.cameraHelper = new CameraHelper(this.camera)
		this.cameraHelper.visible = false
		this.add(this.cameraHelper)

		this.devCamera = new PerspectiveCamera(45, store.window.w / store.window.h, 1, 1000)
		this.devCamera.position.z = 10
		this.devCamera.position.y = 3
		this.add(this.devCamera)

		this.controls = new OrbitControls(this.devCamera, store.WebGL.renderer.domElement)
		this.controls.target.set(0, 0, 0)
		this.controls.enabled = this.options.controls
		this.controls.enableDamping = true

		this.background = new Color(0x222222)
		// this.fog = new Fog(0x000000, this.camera.near, this.camera.far)

		/* Add scene components */
		this.components = {
			// sim: new Sim(),
			background: new Background(),
			letter: new Letter(),
			projects: new Projects()
		}

		this.load()

		E.on('App:start', () => {
			this.createFbo()
			this.build()
			this.addEvents()
		})
	}

	build() {
		this.buildDebugEnvironment()
		this.composer = new EffectComposer(store.WebGL.renderer)
		this.composer.setSize(store.window.w, store.window.h)
		// Build components and add to scene
		for (const key in this.components) {
			this.components[key].build(this.objectData)
			this.add(this.components[key])
		}

		this.buildPasses()
	}

	buildPasses() {
		this.renderScene = new RenderPass(this, this.activeCamera)

		this.fxaaPass = new ShaderPass(FXAAShader)
		this.fxaaPass.material.uniforms.resolution.value.x = 1 / (store.window.w * store.WebGL.renderer.getPixelRatio())
		this.fxaaPass.material.uniforms.resolution.value.y = 1 / (store.window.fullHeight * store.WebGL.renderer.getPixelRatio())

		this.bloomPass = new UnrealBloomPass(new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()), 1, 1, 0.9)
		this.bloomPass.enabled = true
	
		this.screenFxPass = new ShaderPass(new ShaderMaterial({
			vertexShader: screenFxVert,
			fragmentShader: screenFxFrag,
			uniforms: {
				tDiffuse: { value: null },
				uMaxDistort: { value: 0.251 },
				uBendAmount: { value: -0.272 }
			}
		}))

		this.composer.addPass(this.renderScene)
		// this.composer.renderToScreen = false
		// this.composer.addPass(this.fxaaPass)
		this.composer.addPass(this.bloomPass)
		// this.composer.addPass(this.screenFxPass)

		// const finalPass = new ShaderPass(
		// 	new ShaderMaterial({
		// 		uniforms: {
		// 			baseTexture: { value: null },
		// 			bloomTexture: { value: this.composer.renderTarget2.texture }
		// 		},
		// 		vertexShader: finalFxVert,
		// 		fragmentShader: finalFxFrag,
		// 		defines: {}
		// 	}), 'baseTexture'
		// )
		// finalPass.needsSwap = true

		// this.finalComposer = new EffectComposer(store.WebGL.renderer)
		// this.finalComposer.setSize(store.window.w, store.window.h)
		// this.finalComposer.addPass(this.renderScene)
		// this.finalComposer.addPass(finalPass)
		console.log(this.composer)
	}

	createFbo() {
		// store.simFbo = new WebGLRenderTarget(
		// 	store.window.w * store.WebGL.renderer.getPixelRatio(),
		// 	store.window.h * store.WebGL.renderer.getPixelRatio()
		// )
		E.emit('fboCreated')
	}

	buildDebugEnvironment() {
		this.add(new AmbientLight(0xf0f0f0))
		this.light = new SpotLight(0xffffff, 1.5)
		this.light.position.set(0, 1500, 200)
		this.light.angle = Math.PI * 0.2
		this.light.castShadow = true
		this.add(this.light)

		this.grid = new GridHelper(200, 50)
		this.grid.position.y = -10
		this.grid.material.opacity = 0.5
		this.grid.material.transparent = true
		this.add(this.grid)
	}

	addEvents() {
		E.on(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.add(this.onRaf, 1)
	}

	onRaf = () => {
		// store.WebGL.renderer.setRenderTarget(store.envFbo)
		// store.WebGL.renderer.render(this, this.camera)
		// store.WebGL.renderer.setRenderTarget(null)
		// store.WebGL.renderer.render(this, this.camera)
		this.controls.enabled && this.controls.update()

		if (this.controls.enabled) {
			store.WebGL.renderer.render(this, this.devCamera)
			this.activeCamera = this.devCamera
		} else {
			store.WebGL.renderer.render(this, this.camera)
			this.activeCamera = this.camera
		}

		store.Gui && store.Gui.refresh(false)

		this.composer.render()
	}

	onResize = () => {
		this.camera.aspect = store.window.w / store.window.h
		this.camera.updateProjectionMatrix()
		store.envFbo.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.composer.setSize(store.window.w, store.window.h)
	}

	load() {
		this.assets = {
			textures: {},
			models: {}
		}

		store.AssetLoader.loadTexture('/textures/background.jpeg').then(texture => {
			this.backgroundTexture = texture
		})

		// Load .unseen file
		// store.AssetLoader.loadJson('./objectdata.unseen').then(data => {
		// 	this.objectData = data
		// })

		// Global assets
	}
}