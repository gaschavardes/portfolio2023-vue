import { Group, PlaneGeometry, Color, Mesh, Vector2, Object3D, InstancedMesh, Vector3, InstancedBufferAttribute} from 'three'
import { ProjectMaterial, ParticleMaterial } from '../materials'
import store from '../store'
import gsap from 'gsap'
import { qs } from '../utils'
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
		this.yPos = 0

	}

	build() {
		// store.projects.forEach(el => {
		this.createPlane()
		this.createParticle()
		// })
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
		mesh.position.set(0, 0, 0)
		this.mesh = mesh
	}

	createParticle() {
		const texture = store.MainScene.backgroundTexture
		const image = texture.source.data
		console.log(image)
		this.canvas = qs('canvas#texture')
		this.ctx = this.canvas.getContext("2d")
		console.log(this.canvas)
		const size = new Vector2(image.width * 0.1, image.height * 0.1)
		this.canvas.width = size.x ;
		this.canvas.height = size.y ;
		this.ctx.translate(0, size.y)
		this.ctx.scale(1, -1)
		this.ctx.drawImage(image, 0, 0, size.x, size.y);
		const data = this.ctx.getImageData(0, 0, size.x, size.y);
		
		const particles = [];
		console.log(data.height)
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
		console.log(particles)
		const color = []
		this.instance = new InstancedMesh(
			new PlaneGeometry(1, 1),
			new ParticleMaterial({
				uniforms: {
					resolution: { value: new Vector2(store.window.w, store.window.h)},
				}
			}),
			particles.length
		)
		let scale = 0.068
		this.dummy.scale.set(scale,scale,1)
		
		particles.forEach((el, i) => {
			this.dummy.position.set(el.x * scale, el.y * scale, 0)
			this.dummy.updateMatrix()
			color.push(...[el.color.x, el.color.y, el.color.z] )
			this.instance.setMatrixAt(i, this.dummy.matrix)
		})
		this.instance.instanceMatrix.needsUpdate = true
		this.instance.geometry.setAttribute('colorVal', new InstancedBufferAttribute(new Float32Array(color), 3))
		this.add(this.instance)
		console.log(this.instance)
		this.instance.position.set(0, 0, 0)

	}

	createTimeline() {
		this.timeline = gsap.timeline({ paused: true })
		for (let index = 0; index < store.projects.length; index++) {
			console.log('COUCOU')
			this.timeline.to(this, {  yPos: 0 })
			this.timeline.to(this, {  yPos: 10 }, '+=1')
			this.timeline.set(this, {  yPos: -10 })
		}
	}

	animate = () => {
		if(this.timeline) {
			this.timeline.progress(this.progress)
		}
		if(this.instance && this.mesh) {
			this.instance.position.y = this.yPos
			this.mesh.position.y = this.yPos
		}
		
		// this.meshes.forEach((el, i) => {
		// 	if(i === 1) {
		// 		console.log((this.progress * this.meshes.length - i ) / this.meshes.length)
		// 	}
		// 	const meshProgress = ((this.progress * this.meshes.length - i) / this.meshes.length) * 100.
		// 	el.position.set(0, meshProgress, 0)
		// })
	}

	load() {
		this.assets = {
			models: {},
			textures: {}
		}

		// Load component assets if needed
		// store.AssetLoader.loadGltf('./models/model.glb').then(gltf => {
		// 	this.assets.models.rockFormation = gltf.scene.children[0]
		// })
	}
}