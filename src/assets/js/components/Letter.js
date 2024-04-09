import { GlassMaterial, BackFaceMaterial } from '../materials'
import { Mesh, WebGLRenderTarget, PlaneGeometry, Group, BufferGeometry, BufferAttribute, Vector3, Box3, Vector2 } from 'three/src/Three'
import store from '../store'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
gsap.registerPlugin(ScrollTrigger)

export default class Letter extends Group {
	constructor(options) {
		super(options)
		this.camera = store.MainScene.camera
		this.orthoCamera = store.MainScene.orthoCamera
		this.explodeProgress = -20
		this.appearProgress = 0
		this.load()
		store.landing = this
		this.centers = {}
		this.easedMouse = new Vector2()
		this.easedMouseTemp = new Vector2()
		this.easedScroll = 0
		// this.parent = options.parent
		this.intro = document.querySelector('.intro')

		E.on(GlobalEvents.RESIZE, this.onResize)
	}

	build() {
		store.envFbo = new WebGLRenderTarget(
			store.window.w * store.WebGL.renderer.getPixelRatio(),
			store.window.h * store.WebGL.renderer.getPixelRatio()
		)
		store.env = new WebGLRenderTarget(
			store.window.w * store.WebGL.renderer.getPixelRatio(),
			store.window.h * store.WebGL.renderer.getPixelRatio()
		)
		// this.quad = this.createBackground()
		this.item = new Group()
		this.scale.setScalar(store.isMobile ? 0.05 : 0.1)
		this.fboCreate()


		this.scrollTrigger = ScrollTrigger.create({
			trigger: this.intro, 
			start: "top top",
			end: "bottom top",
		})
		// store.RAFCollection.add(this.animate, 0)

		// this.item.onBeforeRender = () => {
		// }

	}

	fboCreate = () => {
		this.backfaceFboBroken = new WebGLRenderTarget(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.backfaceFbo = new WebGLRenderTarget(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.GlassMaterial = new GlassMaterial({
			envMap: store.envFbo.texture,
			resolution: [store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()],
			backfaceMapBroken: this.backfaceFboBroken.texture,
			backfaceMap: this.backfaceFbo.texture,
			matcap: this.matcap,
			progress: 0,
			fresnelVal: 1,
			refractPower: 10,
			uMap: store.MainScene.backgroundTexture
		})
		this.backfaceMaterial = new BackFaceMaterial()
		this.item = new Mesh(new BufferGeometry(), this.GlassMaterial)
		this.fullItem = new Mesh(new PlaneGeometry(), this.backfaceMaterial)
		this.drawPieces()
		this.drawBack()
		// this.item.rotation.x = -Math.PI * 0.5
		// this.fullItem.rotation.x = -Math.PI * 0.5
		this.add(this.item)
		this.add(this.fullItem)
		// this.fullItem.layers.set(1)
	}

	drawBack() {
		const position = []
		const letterCenter = []
		const normal = []
		const index = []
		const letters = []
		const geometry = new BufferGeometry()

		this.assets.models.backface.children.forEach((el) => {
			switch (el.geometry.name) {
				case 'h':
					this.letter = 4
					break
				case 'e':
					this.letter = 3
					break
				case 'l1':
					this.letter = 2
					break
				case 'l2':
					this.letter = 1
					break
				case 'o':
					this.letter = 0
					break
				default:
					break
			}
			// const centerVectorArray = []
			for (let i = 0; i < el.geometry.attributes.position.array.length; i = i + 3) {
				position.push(el.geometry.attributes.position.array[i] + el.position.x * 0.01)
				position.push(el.geometry.attributes.position.array[i + 1])
				position.push(el.geometry.attributes.position.array[i + 2])

				letterCenter.push(this.centers[el.geometry.name].x)
				letterCenter.push(this.centers[el.geometry.name].y)
				letterCenter.push(this.centers[el.geometry.name].z)

				letters.push(this.letter)
			}

			for (let i = 0; i < el.geometry.attributes.normal.array.length; i = i + 3) {
				normal.push(el.geometry.attributes.normal.array[i])
				normal.push(el.geometry.attributes.normal.array[i + 1])
				normal.push(el.geometry.attributes.normal.array[i + 2])
			}
		})
		const positionArray = new Float32Array(position)
		const normalArray = new Float32Array(normal)
		const indexArray = new Float32Array(index)
		// const centroidArray = new Float32Array(centroidVal)
		// const randomArray = new Float32Array(random)
		const lettersArray = new Float32Array(letters)
		const letterCenterArray = new Float32Array(letterCenter)

		// this.progressArray = new Float32Array(progress)
		geometry.setAttribute('position', new BufferAttribute(positionArray, 3))
		// geometry.setAttribute('center', new BufferAttribute(centroidArray, 3))
		geometry.setAttribute('normal', new BufferAttribute(normalArray, 3))
		geometry.setAttribute('index', new BufferAttribute(indexArray, 1))
		// geometry.setAttribute('random', new BufferAttribute(randomArray, 3))
		// geometry.setAttribute('progress', new BufferAttribute(this.progressArray, 1))
		geometry.setAttribute('letter', new BufferAttribute(lettersArray, 1))
		geometry.setAttribute('letterCenter', new BufferAttribute(letterCenterArray, 3))
		this.fullItem.geometry = geometry
		this.fullItem.geometry.computeBoundingSphere()
		this.fullItem.geometry.boundingSphere.radius *= 10
	}

	drawPieces() {
		const position = []
		const normal = []
		const index = []
		const random = []
		const centroidVal = []
		const progress = []
		const letters = []
		const letterCenter = []
		const uv = []
		let indexVal = 0
		const geometry = new BufferGeometry()
		for (const key in this.letters) {
			const pieces = this.letters[key].children
			switch (key) {
				case 'h':
					this.letter = 4
					break
				case 'e':
					this.letter = 3
					break
				case 'l1':
					this.letter = 2
					break
				case 'l2':
					this.letter = 1
					break
				case 'o':
					this.letter = 0
					break
				default:
					break
			}
			this.centers[key] = []
			const centerVectorArray = []
			pieces.forEach((piece) => {
				for (let i = 0; i < piece.geometry.attributes.position.array.length; i = i + 3) {
					centerVectorArray.push(piece.geometry.attributes.position.array[i])
					centerVectorArray.push(piece.geometry.attributes.position.array[i + 1])
					centerVectorArray.push(piece.geometry.attributes.position.array[i + 2])
				}
			})
			const center = new Vector3()
			new Box3().setFromArray(centerVectorArray).getCenter(center)
			this.centers[key] = center
		
			pieces.forEach((piece) => {
				if (piece.geometry) {
					piece.geometry.computeBoundingBox()
					const centroid = new Vector3()
					piece.geometry.boundingBox.getCenter(centroid)
					const randomVal = new Vector3(this.randomIntFromInterval(5, 20), this.randomIntFromInterval(5, 20), this.randomIntFromInterval(3, 5))
					for (let i = 0; i < piece.geometry.attributes.position.array.length; i = i + 3) {
						position.push(piece.geometry.attributes.position.array[i])
						position.push(piece.geometry.attributes.position.array[i + 1])
						position.push(piece.geometry.attributes.position.array[i + 2])

						index.push(indexVal)

						centroidVal.push(centroid.x)
						centroidVal.push(centroid.y)
						centroidVal.push(centroid.z)

						random.push(randomVal.x)
						random.push(randomVal.y)
						random.push(randomVal.z)

						letterCenter.push(center.x)
						letterCenter.push(center.y)
						letterCenter.push(center.z)

						letters.push(this.letter)

						progress.push(0)
					}
					for (let i = 0; i < piece.geometry.attributes.normal.array.length; i = i + 3) {
						normal.push(piece.geometry.attributes.normal.array[i])
						normal.push(piece.geometry.attributes.normal.array[i + 1])
						normal.push(piece.geometry.attributes.normal.array[i + 2])
					}
					for (let i = 0; i < piece.geometry.attributes.uv.array.length; i = i + 2) {
						uv.push(piece.geometry.attributes.uv.array[i])
						uv.push(piece.geometry.attributes.uv.array[i + 1])
					}
					indexVal++
				}
			})
		}

		const positionArray = new Float32Array(position)
		const normalArray = new Float32Array(normal)
		const indexArray = new Float32Array(index)
		const centroidArray = new Float32Array(centroidVal)
		const randomArray = new Float32Array(random)
		const lettersArray = new Float32Array(letters)
		const uvArray = new Float32Array(uv)
		this.letterCenterArray = new Float32Array(letterCenter)
		this.progressArray = new Float32Array(progress)
		geometry.setAttribute('position', new BufferAttribute(positionArray, 3))
		geometry.setAttribute('center', new BufferAttribute(centroidArray, 3))
		geometry.setAttribute('normal', new BufferAttribute(normalArray, 3))
		geometry.setAttribute('index', new BufferAttribute(indexArray, 1))
		geometry.setAttribute('random', new BufferAttribute(randomArray, 3))
		geometry.setAttribute('progress', new BufferAttribute(this.progressArray, 1))
		geometry.setAttribute('letter', new BufferAttribute(lettersArray, 1))
		geometry.setAttribute('letterCenter', new BufferAttribute(this.letterCenterArray, 3))

		geometry.setAttribute( 'uv', new BufferAttribute( uvArray, 2 ) )
		this.item.geometry = geometry
		this.item.geometry.computeBoundingSphere()
		this.item.geometry.boundingSphere.radius *= 10


		E.on('LoaderOut', () => {
			gsap.fromTo(this, { appearProgress: 1.4 }, {
				appearProgress: 0,
				yoyo: true,
				repeat: 0,
				duration: 4,
				ease: 'power1.easeInOut',
				onUpdate: () => {
					this.GlassMaterial.uniforms.uAppear.value = this.appearProgress
					this.backfaceMaterial.uniforms.uAppear.value = this.appearProgress
				}
			})
		})
	
	}

	explode() {
		this.visible = true
		this.GlassMaterial.uniforms.uTime.value = store.time
		this.backfaceMaterial.uniforms.uTime.value = store.time
		this.GlassMaterial.uniforms.uStartingTime.value = store.time
		this.backfaceMaterial.uniforms.uStartingTime.value = store.time
		// gsap.to(this, {
		// 	explodeProgress: 0.2,
		// 	duration: 4,
		// 	ease: 'power1.easeInOut',
		// 	onUpdate: () => {
		// 		this.GlassMaterial.uniforms.uProgress.value = this.explodeProgress
		// 		this.backfaceMaterial.uniforms.uProgress.value = this.explodeProgress
		// 	}
		// })
		// qs('.js-landing .headline').classList.add('show')
	}


	randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	stop() {
		store.RAFCollection.remove(this.animate, 0)
	}
	start() {
		store.RAFCollection.add(this.animate, 0)
		gsap.fromTo(this, { appearProgress: 1.4 }, {
			appearProgress: 0,
			yoyo: true,
			repeat: 0,
			duration: 4,
			delay: 1,
			ease: 'power1.easeInOut',
			onUpdate: () => {
				this.GlassMaterial.uniforms.uAppear.value = this.appearProgress
				this.backfaceMaterial.uniforms.uAppear.value = this.appearProgress
			}
		})
	}

	animate = () => {
		if (!this.item) return
		// Ease Mouse movement
		this.easedMouseTemp.subVectors(store.pointer.glNormalized, this.easedMouse)
		this.easedMouseTemp.multiplyScalar(0.1)
		this.easedMouse.addVectors(this.easedMouseTemp, this.easedMouse)
		this.GlassMaterial.uniforms.uMouse.value = this.easedMouse
		this.backfaceMaterial.uniforms.uMouse.value = this.easedMouse
		////

		// Ease Scroll
		this.easedScroll += (this.scrollTrigger.progress - this.easedScroll) * 0.1
		this.GlassMaterial.uniforms.uProgress.value = this.easedScroll * 60 - 20
		this.backfaceMaterial.uniforms.uProgress.value = this.easedScroll * 60 - 20
		////

		this.GlassMaterial.uniforms.uTime.value = store.WebGL.globalUniforms.uTime.value

		if(this.easedScroll < 0.9) {
			if(store.MainScene.bloomPass) {
				store.MainScene.bloomPass.threshold = 0.93
			}
			this.item.visible = false
			store.WebGL.renderer.setRenderTarget(store.envFbo)
			store.WebGL.renderer.render(store.MainScene, store.MainScene.activeCamera)
			this.item.visible = true
			// store.WebGL.renderer.clearDepth()
			// render cube backfaces to fbo

	
			this.item.material = this.backfaceMaterial
			store.WebGL.renderer.setRenderTarget(this.backfaceFboBroken)
			store.WebGL.renderer.render(store.MainScene, store.MainScene.activeCamera)
	
			this.item.visible = false
			this.fullItem.visible = true
	
			store.WebGL.renderer.setRenderTarget(null)
			this.fullItem.material = this.backfaceMaterial
			store.WebGL.renderer.setRenderTarget(this.backfaceFbo)
	
			// store.WebGL.renderer.clearDepth()
			store.WebGL.renderer.render(store.MainScene, store.MainScene.activeCamera)
	
			// render env to screen
			store.WebGL.renderer.setRenderTarget(null)
			// store.WebGL.renderer.render(this, this.store.MainScene.activeCamera)
			// store.WebGL.renderer.clearDepth()
			this.fullItem.visible = false
			this.item.visible = true
			// render cube with refraction material to screen
			this.item.material = this.GlassMaterial
			// store.WebGL.renderer.render(this.parent, this.camera)

			// store.MainScene.components.projects.instance.visible = false
		} else {
			if(this.item.visible) this.item.visible = false
			store.MainScene.components.projects.instance.visible = true
			if(store.MainScene.bloomPass) {
				store.MainScene.bloomPass.threshold = 0.99
			}
		}
		
	}

	load() {
		this.assets = {
			models: {},
			textures: {}
		}
		this.letters = {}

		const models = ['h', 'e', 'l1', 'l2', 'o']

		models.forEach(el => {
			store.AssetLoader.loadFbx((`/models/${el}.fbx`)).then(gltf => {
				// this.pieces = gltf.children
				this.letters[el] = gltf
			})
		})

		store.AssetLoader.loadTexture('/textures/iridescent32.png').then(texture => {
			this.matcap = texture
		})

		store.AssetLoader.loadTexture('/textures/background.jpeg').then(texture => {
			this.backgroundTexture = texture
		})

		store.AssetLoader.loadFbx(('models/helloBack.fbx')).then(gltf => {
			this.assets.models.v = gltf.children[0]
			this.assets.models.backface = gltf
		})
	}

	dispose() {
		// E.on('fboCreated', this.fboCreate)
	}

	onResize = () => {
		this.backfaceFboBroken.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.backfaceFbo.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.GlassMaterial.uniforms.resolution.value = [store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()]
		// this.backfaceMaterial.uniforms.resolution.value = [store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()]
	}
}