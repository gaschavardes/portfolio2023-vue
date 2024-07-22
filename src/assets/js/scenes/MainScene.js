/* eslint-disable */
import { Color, PerspectiveCamera, LinearFilter, CustomSavePass, CameraHelper, OrthographicCamera, Scene, AmbientLight, SpotLight, GridHelper, Vector2, ShaderMaterial, WebGLRenderTarget} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Background from '../components/Background'
// import Hello from '../components/Hello'
import Letter from '../components/Letter'
import Projects from '../components/Projects'
import DomText from '../components/DomText'
import store from '../store'
import { E, SavePass } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import screenFxVert from '../../../../glsl/includes/screenFx/vert.glsl'
import screenFxFrag from '../../../../glsl/includes/screenFx/frag.glsl'
import Sim from '../components/Sim'

export default class MainScene extends Scene {
	constructor() {
		super()

		store.MainScene = this
		this.options = {
			controls: window.urlParams.has('controls')
		}

		this.camera = new PerspectiveCamera(45, store.window.w / store.window.h, 2, 1000)
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

		/* Add scene components */
		this.components = {
			// sim: new Sim(),
			background: new Background(),
			letter: new Letter(),
			projects: new Projects(),
			domText: new DomText()
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
		this.bloomPass = new UnrealBloomPass(new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()), 1.5, 1, .8)
		this.bloomPass.enabled = true


		// this.composer.addPass(this.renderScene)
		// this.composer.addPass(this.screenFxPass)
		// this.composer.addPass(this.bloomPass)
		store.WebGL.composerPasses.add(this.renderScene)
		store.WebGL.composerPasses.add(this.bloomPass, 1)

		this.renderPass = new RenderPass(this, this.camera)
		this.renderPass.name = this.name
		this.renderPass.enabled = true
		this.renderPass.renderToScreen = false

		// The final save pass used for transitioning
		this.savePass = new SavePass(new WebGLRenderTarget(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio(), {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			depthBuffer: false
		}))
		this.savePass.name = `${this.name} Final`
		this.savePass.enabled = true
		store.WebGL.composerPasses.add(this.renderPass, 0)
		store.WebGL.composerPasses.add(this.savePass, 2)
	}

	createFbo() {
		store.simFbo = new WebGLRenderTarget(
			store.window.w * store.WebGL.renderer.getPixelRatio(),
			store.window.h * store.WebGL.renderer.getPixelRatio()
		)
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
	}

	addEvents() {
		E.on(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.add(this.onRaf, 1)
	}

	removeEvents() {
		E.off(GlobalEvents.RESIZE, this.onResize)
		store.RAFCollection.remove(this.onRaf, 1)
	}



	start() {
		this.addEvents()
		this.onResize()
		for (const key in this.components) {
			this.components[key].start && this.components[key].start()
		}
	}

	stop() {
		this.removeEvents()
		
		for (const key in this.components) {
			this.components[key].stop && this.components[key].stop()
		}
	}


	onRaf = () => {
		this.controls.enabled && this.controls.update()

		if (this.controls.enabled) {
			// store.WebGL.renderer.render(this, this.devCamera)
			this.activeCamera = this.devCamera
		} else {
			// store.WebGL.renderer.render(this, this.camera)
			this.activeCamera = this.camera
		}

		store.Gui && store.Gui.refresh(false)

		// this.composer.render()
	}

	onResize = () => {
		this.savePass.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
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
	}
}