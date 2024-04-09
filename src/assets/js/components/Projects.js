import { Group, PlaneGeometry, Color, Vector2, Object3D, InstancedMesh, InstancedBufferAttribute, VideoTexture} from 'three'
import { ParticleMaterial } from '../materials'
import store from '../store'
import gsap from 'gsap'
import { E, qs, qsa } from '../utils'
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
	}

	createParticle() {
		const texture = store.MainScene.backgroundTexture
		const image = texture.source.data
		// this.canvas = qs('canvas#texture')
		this.video =  qs('video#videoContainer')
		this.videos = qsa('.video_preload video')
		this.videos.forEach(el => {
			el.texture = new VideoTexture( el )
		})
		// this.video.play()
		// this.ctx = this.canvas.getContext("2d", { willReadFrequently: true})
		
		const size = store.isMobile ? new Vector2(image.width * 0.7, image.width * 0.7 * 9/16) : new Vector2(image.width * 1,  image.width * 1 * 9/16)
		// this.canvas.width = 100;
		// this.canvas.height = size.x * 16/9;
		// this.ctx.translate(0, size.y)
		// this.ctx.scale(1, -1)
		// this.ctx.drawImage(image, 0, 0, size.x, size.y);
		// const data = this.ctx.getImageData(0, 0, size.x, size.y);
		
		const particles = []
		const aIDs = []
		const aUVIDs = []
		const step = store.isMobile ? 4 : 2
		for (let y = 0, y2 = size.y; y < y2; y = y + step) {
			for (let x = 0, x2 = size.x; x < x2; x = x + step) {
				// if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
					const particle = {
						x : (x - size.x * 0.5),
						y : (y - size.y * 0.5),
					};
					particles.push(particle);
					aIDs.push(x + 1)
					// aUVIDs.push(x % data.height)
					aUVIDs.push(x / step)
					aUVIDs.push(y / step)
				// }
			}
		}
		// const color = []
		const random = []
		this.instance = new InstancedMesh(
			new PlaneGeometry(step, step),
			new ParticleMaterial({
				uniforms: {
					resolution: { value: new Vector2(store.window.w * store.window.dpr, store.window.h * store.window.dpr)},
					spriteSize: {value: new Vector2(size.x / step, size.y / step ) },
					videoTexture: { value: null }
				}
			}),
			particles.length
		)
		let scale = 0.0062 * 2
		this.dummy.scale.set(scale,scale,1)
		particles.forEach((el, i) => {
			this.dummy.position.set(el.x * scale, el.y * scale, 0)
			this.dummy.updateMatrix()
			// color.push(...[el.color.x, el.color.y, el.color.z] )
			random.push(Math.random() * 10)
			this.instance.setMatrixAt(i, this.dummy.matrix)
		})
		this.instance.instanceMatrix.needsUpdate = true
		// this.instance.geometry.setAttribute('colorVal', new InstancedBufferAttribute(new Float32Array(color), 3))
		this.instance.geometry.setAttribute('random', new InstancedBufferAttribute(new Float32Array(random), 1))
		this.instance.geometry.setAttribute('aID', new InstancedBufferAttribute(new Float32Array(aIDs), 1))
		this.instance.geometry.setAttribute('aUVID', new InstancedBufferAttribute(new Float32Array(aUVIDs), 2))
		this.add(this.instance)
		this.instance.position.set(0, 10, 0)
		this.instance.visible = false

	}

	start = () => {
		this.video =  qs('video#videoContainer')
		this.videos = qsa('.video_preload video')
		this.videos.forEach(el => {
			el.texture = new VideoTexture( el )
		})
		this.instance.material.uniforms.videoTexture.value = this.video
		this.createTimeline()

	}
	stop() {
		if(this.timeline) this.timeline.kill()
	}

	createTimeline() {
		this.timeline = gsap.timeline({ paused: true })
		for (let index = 0; index < store.projects.length; index++) {
			this.timeline
			.call(() => { this.instance.material.uniforms.videoTexture.value = this.videos[index].texture})
			.to(this, {  yPos: 0 })
			.to(this, {  yPos: 10, ease: 'none' })
			.set(this, {  yPos: -10, ease: 'none' })
			.call(() => { this.instance.material.uniforms.videoTexture.value = this.videos[index].texture})
			// .call(this.textureUpdate)
		}
	}

	animate = () => {
		if(this.timeline) {
			this.progressEased += (this.progress - this.progressEased) * 0.1
			this.timeline.progress(this.progressEased)
		}
		if(this.instance) {
			this.instance.position.y = this.yPos
			this.instance.material.uniforms.uYpos.value = this.yPos;
			this.instance.rotation.z = Math.sin(this.yPos * 0.1)
			this.instance.rotation.x = Math.sin(-this.yPos * 0.1)
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