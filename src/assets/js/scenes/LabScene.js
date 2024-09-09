/* eslint-disable */
import { Color, PerspectiveCamera, LinearFilter, CameraHelper, OrthographicCamera, Scene, AmbientLight, SpotLight, GridHelper, Vector2, ShaderMaterial, WebGLRenderTarget, PMREMGenerator} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import InteractiveGrid from '../components/InteractiveGrid'
import Text from '../components/Text'
import MarchingCubes from '../components/MarchingCubes'
import Exp1 from '../components/Exp1'
import store from '../store'
import { E, SavePass } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'


export default class LabScene extends Scene {
	constructor() {
		super()
		store.LabScene = this
		this.options = {
			controls: window.urlParams.has('controls')
		}

		this.camera = new PerspectiveCamera(45, store.window.w / store.window.h, 0.1, 1000)
		this.camera.position.z = 20
		this.add(this.camera)


		this.orthoCamera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
		// this.orthoCamera.position.z = 5

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

		this.background = new Color(0x000000)

		/* Add scene components */
		this.components = {
			// aiSphere: new AISphere()
			// imageSequence: new ImageSequence()
			interactiveGrid: new InteractiveGrid(),
			exp1: new Exp1(),
			// MarchingCubes: new MarchingCubes(),
			// text: new Text()
			// background: new Background(),
			// text: new Text()
			// letter: new Letter(),
			// projects: new Projects()
		}

		this.load()

		E.on('App:start', () => {
			// this.createFbo()
			this.build()
		})
	}

	build() {
		this.composer = new EffectComposer(store.WebGL.renderer)
		this.composer.setSize(store.window.w, store.window.h)
		// Build components and add to scene
		for (const key in this.components) {
			this.components[key].build(this.objectData)
			this.add(this.components[key])
		}

	
		this.setupEnvironment()
		// this.waterTexture = new WaterTexture({ debug: true })

		this.buildPasses()
	}

	async setupEnvironment() {
		const envMap = await this.loadHDRI('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/empty_warehouse_01_1k.hdr', store.WebGL.renderer)
		this.environment = envMap
	}

	buildPasses() {
		this.renderScene = new RenderPass(this, this.activeCamera)
		this.fxaaPass = new ShaderPass(FXAAShader)
		this.fxaaPass.material.uniforms.resolution.value.x = 1 / (store.window.w * store.WebGL.renderer.getPixelRatio())
		this.fxaaPass.material.uniforms.resolution.value.y = 1 / (store.window.fullHeight * store.WebGL.renderer.getPixelRatio())

		this.bloomPass = new UnrealBloomPass(new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()), 1., 1., .9)
		this.bloomPass.enabled = true
	
		this.composer.addPass(this.renderScene)
		// this.composer.addPass(this.screenFxPass)
		// this.composer.addPass(this.bloomPass)

		this.renderPass = new RenderPass(this, this.camera)
		this.renderPass.name = this.name
		this.renderPass.enabled = false
		this.renderPass.renderToScreen = false

		// The final save pass used for transitioning
		this.savePass = new SavePass(new WebGLRenderTarget(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio(), {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			depthBuffer: false
		}))

		this.savePass.name = `${this.name} Final`
		this.savePass.enabled = false
		store.WebGL.composerPasses.add(this.renderPass, 19)
		store.WebGL.composerPasses.add(this.savePass, 21)
		store.WebGL.composerPasses.add(this.bloomPass, 20)
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
		// store.MainScene.bloomPass.threshold = 0.5
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
		// store.MainScene.bloomPass.threshold = 0.1
		this.controls.enabled && this.controls.update()

		if (this.controls.enabled) {
			// store.WebGL.renderer.render(this, this.devCamera)
			// this.activeCamera = this.devCamera
		} else {
			// store.WebGL.renderer.render(this, this.camera)
			// this.activeCamera = this.orthoCamera
		}

		store.Gui && store.Gui.refresh(false)
		if(this.components.MarchingCubes) this.components.MarchingCubes.animate()
		if(this.components.aiSphere) this.components.aiSphere.animate()

		// this.composer.render()
	}

	onResize = () => {
		this.camera.aspect = store.window.w / store.window.h
		this.camera.updateProjectionMatrix()
		// store.envFbo.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.composer.setSize(store.window.w, store.window.h)
	}

	load() {
		this.assets = {
			textures: {},
			models: {}
		}

		// store.AssetLoader.loadTexture(backgroundImg).then(texture => {
		// 	this.backgroundTexture = texture
		// })
	}

	loadHDRI(url, renderer) {
		return new Promise(resolve => {
		  const loader = new RGBELoader()
		  const pmremGenerator = new PMREMGenerator(renderer)
		  loader.load(url, (texture) => {
			const envMap = pmremGenerator.fromEquirectangular(texture).texture
			texture.dispose()
			pmremGenerator.dispose()
			resolve(envMap)
		  })
		})
	  }
}