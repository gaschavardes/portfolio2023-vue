import { Group, PlaneGeometry, Color, Mesh, Vector2, Object3D, InstancedMesh, Vector3, InstancedBufferAttribute} from 'three'
import { ProjectMaterial, ParticleMaterial } from '../materials'
import store from '../store'
import gsap from 'gsap'
import { E, qs } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
// import { copyObjectDataTransforms } from '../utils'

export default class Projects extends Group {
	constructor() {
		super()

		this.globalUniforms = {
			uColor: { value: new Color(0xf3ff8f) }
		}
		this.meshes = []
		this.dummy = new Object3D()
		this.progress = 0
		this.load()
		store.RAFCollection.add(this.animate, 4)
		E.on(GlobalEvents.RESIZE, this.onResize)
		this.yPos = -10
		this.progressEased = 0

	}

	build() {
		this.createParticle()
		this.createTimeline()
	}

	createPlane(){
		const mesh = new Mesh(
			new PlaneGeometry(5, 5 *  store.MainScene.backgroundTexture.source.data.height / store.MainScene.backgroundTexture.source.data.width),
			new ProjectMaterial({ uniforms: {
				resolution: { value: new Vector2(store.window.w, store.window.h)},
				map: { value: store.MainScene.backgroundTexture }
			}, globalUniforms: this.globalUniforms })
		)
		this.add(mesh)
		mesh.position.set(0, 10, 0)
		this.mesh = mesh
	}

	createParticle() {
		const texture = store.MainScene.backgroundTexture
		const image = texture.source.data
		this.canvas = qs('canvas#texture')
		this.ctx = this.canvas.getContext("2d", { willReadFrequently: true})
		
		const size = store.isMobile ? new Vector2(image.width * 0.5, image.height * 0.5) : new Vector2(image.width * 0.8, image.height * 0.8)
		this.canvas.width = size.x ;
		this.canvas.height = size.y ;
		this.ctx.translate(0, size.y)
		this.ctx.scale(1, -1)
		this.ctx.drawImage(image, 0, 0, size.x, size.y);
		const data = this.ctx.getImageData(0, 0, size.x, size.y);
		
		const particles = [];
		for (let y = 0, y2 = data.height; y < y2; y++) {
			for (let x = 0, x2 = data.width; x < x2; x++) {
				if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
					const particle = {
						x : (x - size.x * 0.5),
						y : (y - size.y * 0.5),
						color: new Vector3(data.data[(y * 4 * data.width)+ (x * 4)] / 255, data.data[(y * 4 * data.width)+ (x * 4) +1] / 255, data.data[(y * 4 * data.width)+ (x * 4) +2] / 255)
					};
					particles.push(particle);
				}
			}
		}
		const color = []
		const random = []
		this.instance = new InstancedMesh(
			new PlaneGeometry(1, 1),
			new ParticleMaterial({
				uniforms: {
					resolution: { value: new Vector2(store.window.w * store.window.dpr, store.window.h * store.window.dpr)},
				}
			}),
			particles.length
		)
		let scale = 0.0062 * 2
		this.dummy.scale.set(scale,scale,1)
		
		particles.forEach((el, i) => {
			this.dummy.position.set(el.x * scale, el.y * scale, 0)
			this.dummy.updateMatrix()
			color.push(...[el.color.x, el.color.y, el.color.z] )
			random.push(Math.random() * 10)
			this.instance.setMatrixAt(i, this.dummy.matrix)
		})
		this.instance.instanceMatrix.needsUpdate = true
		this.instance.geometry.setAttribute('colorVal', new InstancedBufferAttribute(new Float32Array(color), 3))
		this.instance.geometry.setAttribute('random', new InstancedBufferAttribute(new Float32Array(random), 1))
		this.add(this.instance)
		this.instance.position.set(0, 10, 0)
		this.instance.visible = false

	}

	createTimeline() {
		this.timeline = gsap.timeline({ paused: true })
		for (let index = 0; index < store.projects.length; index++) {
			this.timeline.to(this, {  yPos: 0 })
			.to(this, {  yPos: 10, ease: 'none' })
			.set(this, {  yPos: -10, ease: 'none' })
			.call(this.textureUpdate)
		}
	}

	textureUpdate = () => {
		const texture = store.MainScene.backgroundTexture
		const image = texture.source.data
		this.canvas = qs('canvas#texture')
		this.ctx = this.canvas.getContext("2d", { willReadFrequently: true})
		const size = store.isMobile ? new Vector2(image.width * 0.5, image.height * 0.5) : new Vector2(image.width * 0.8, image.height * 0.8)
		this.canvas.width = size.x ;
		this.canvas.height = size.y ;
		this.ctx.translate(0, size.y)
		this.ctx.scale(1, -1)
		this.ctx.drawImage(image, 0, 0, size.x, size.y);
		const data = this.ctx.getImageData(0, 0, size.x, size.y);
		
		const colors = [];
		for (let y = 0, y2 = data.height; y < y2; y++) {
			for (let x = 0, x2 = data.width; x < x2; x++) {
				if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
					colors.push(...[data.data[(y * 4 * data.width)+ (x * 4)] / 255, data.data[(y * 4 * data.width)+ (x * 4) +1] / 255, data.data[(y * 4 * data.width)+ (x * 4) +2] / 255]);
				}
			}
		}
		this.instance.geometry.setAttribute('colorVal', new InstancedBufferAttribute(new Float32Array(colors), 3))
		this.instance.geometry.getAttribute('colorVal').needsUpdate = true

	}

	animate = () => {
		if(this.timeline) {
			this.progressEased += (this.progress - this.progressEased) * 0.1
			this.timeline.progress(this.progressEased)
		}
		if(this.instance) {
			this.instance.position.y = this.yPos
		}
	}

	load() {
		this.assets = {
			models: {},
			textures: {}
		}
	}
	onResize = () => {
		this.instance.material.uniforms.uResolution.value.set(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
	}
}