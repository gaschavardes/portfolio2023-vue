import { Mesh, MeshBasicMaterial, Raycaster, Group, PlaneGeometry, Color, Vector2, Object3D, InstancedMesh, InstancedBufferAttribute, VideoTexture} from 'three'
import { ParticleMaterial } from '../materials'
import store from '../store'
// import gsap from 'gsap'
import { E, qs, qsa } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import gsap from 'gsap'
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
		E.on(GlobalEvents.RESIZE, this.onResize)
		this.yPos = -10
		this.progressEased = 0
		this.easedMouse = new Vector2()
		this.easedMouseTemp = new Vector2()
		this.vel = new Vector2()

		this.rotationVal = 0
		this.tempRotation = Math.PI * 2
		this.rotationProgress = 0
		// this.tempProgress = 
		this.textureNumb = 1

		this.position.set(0, 0, -5)

	}

	build() {
		this.createParticle()
		this.mouseInteraction()
		E.on('videoTextureUpdate', (e) => {
			clearTimeout(this.delay)
			this.delay = setTimeout(() => {
				this.videoUpdate(e)
			}, 200)
		})
	}

	videoUpdate(e){
		this.textureNumb++
		this.textureNumb = this.textureNumb % 2
		

		if(this.previousVid){
			if(e.src === this.previousVid) return
			this.instance.material.uniforms.uTexture1.value = new VideoTexture(this.previousVid)
		} else{
			this.instance.material.uniforms.uTexture1.value = ''
		}
		// this.instance.material.uniforms.uTexture1.needsUpdate = true

		this.previousVid = e.src
		if(e.src === null){
			this.instance.material.uniforms.uTexture.value = ''
			this.previousVid = null
		} else {
			this.instance.material.uniforms.uTexture.value = new VideoTexture( e.src )
		}
		
		// this.instance.material.uniforms.uTexture.needsUpdate = true

		
		this.tempRotation += Math.PI;
		this.tempProgress += 1.2


		gsap.fromTo(this.instance.material.uniforms.uRotationProgress, { value: 0}, { value: 1.2, duration: 2, ease: 'power2.easeInOut', onComplete: ()=> {
			// this.instance.material.uniforms.uRotationProgress.value =  0
		}})


		this.instance.material.uniforms.uRotation.value = this.tempRotation;
		// this.instance.material.uniforms.uRotationProgress.value = this.rotationProgress;
		
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
		const aUVIDsNeg = []
		const step = size.width * 0.05
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


					if(particles[particles.length -2]){
						aUVIDsNeg.push((size.x - step - x) / step)
						aUVIDsNeg.push(y / step)
					} else {
						aUVIDsNeg.push((size.x - step)/step)
						aUVIDsNeg.push(0.)
					}
				// }
			}
		}
		// const color = []
		const maxSize = new Vector2(particles[particles.length-1].x, particles[particles.length-1].y)
		const random = []
		this.instance = new InstancedMesh(
			new PlaneGeometry(step, step),
			new ParticleMaterial({
				uniforms: {
					resolution: { value: new Vector2(store.window.w * store.window.dpr, store.window.h * store.window.dpr)},
					spriteSize: {value: new Vector2(size.x / step, size.y / step ) },
					videoTexture: { value: null },
					uMaxDistance: {value: maxSize.length()}
				}
			}),
			particles.length
		)
		// let scale = 0.0062 * 2
		// this.dummy.scale.set(scale,scale,1)
		particles.forEach((el, i) => {
			this.dummy.position.set(el.x , el.y, 1)
			this.dummy.updateMatrix()
			// color.push(...[el.color.x, el.color.y, el.color.z] )
			random.push(Math.random() * 100)
			this.instance.setMatrixAt(i, this.dummy.matrix)
		})
		this.instance.instanceMatrix.needsUpdate = true
		// this.instance.geometry.setAttribute('colorVal', new InstancedBufferAttribute(new Float32Array(color), 3))
		this.instance.geometry.setAttribute('random', new InstancedBufferAttribute(new Float32Array(random), 1))
		this.instance.geometry.setAttribute('aID', new InstancedBufferAttribute(new Float32Array(aIDs), 1))
		this.instance.geometry.setAttribute('aUVID', new InstancedBufferAttribute(new Float32Array(aUVIDs), 2))
		this.instance.geometry.setAttribute('aUVIDNeg', new InstancedBufferAttribute(new Float32Array(aUVIDsNeg), 2))
		this.add(this.instance)
		this.instance.position.set(0, 0, 0)
		this.instance.scale.set(0.015, 0.015, 0.015)
		this.instance.visible = false

	}

	mouseInteraction() {
		const hitplane = new Mesh(
			new PlaneGeometry(),
			new MeshBasicMaterial()
		) 
		hitplane.scale.setScalar(100)
		hitplane.position.set(0, 0, -5)
		// hitplane.rotation.x = -Math.PI/2
		hitplane.updateMatrix()
		hitplane.updateMatrixWorld()
		let raycaster = new Raycaster()
		// this.add(hitplane)

		this.mouse = new Vector2()
		let v2 = new Vector2()
		window.addEventListener('mousemove', (ev)=>{
			let x = ev.clientX / (window.innerWidth)  - 0.5
			let y = ev.clientY / (window.innerHeight)  - 0.5

			v2.x = x *2;
			v2.y = -y *2;
			raycaster.setFromCamera(v2, store.MainScene.camera)

			let intersects = raycaster.intersectObject(hitplane)

			if(intersects.length > 0){
				let first = intersects[0]
				this.mouse.x = first.point.x * 1/this.instance.scale.x
				this.mouse.y = first.point.y * 1/this.instance.scale.x
			}
		})
	}


	start = () => {
		store.RAFCollection.add(this.animate, 4)

		this.video =  qs('video#videoContainer')
		this.videos = qsa('.video_preload video')
		this.videos.forEach(el => {
			el.texture = new VideoTexture( el )
		})
		this.instance.material.uniforms.videoTexture.value = this.video
		this.createTimeline()

	}
	stop() {
		if(this.timeline) {
		
			this.progress = 0
			this.yPos = -10
			this.progressEased = 0
			this.timeline.progress(0)
			this.timeline.pause()
			this.timeline.kill()
			this.animate()
		}
		store.RAFCollection.remove(this.animate, 4)

	}

	createTimeline() {
		// this.timeline = gsap.timeline({ paused: true })
		// for (let index = 0; index < store.projects.length; index++) {
		// 	this.timeline
		// 	.call(() => { this.instance.material.uniforms.videoTexture.value = this.videos[index].texture})
		// 	.to(this, {  yPos: 0 })
		// 	.to(this, {  yPos: 10, ease: 'none' })
		// 	.set(this, {  yPos: -10, ease: 'none' })
		// 	.call(() => { this.instance.material.uniforms.videoTexture.value = this.videos[index].texture})
		// 	// .call(this.textureUpdate)
		// }
	}

	animate = () => {
		// MOUSE 
		let v3 = new Vector2()
		v3.copy(this.mouse)

		v3.sub(this.instance.material.uniforms.uPos0.value)
		v3.multiplyScalar(0.1)
		this.instance.material.uniforms.uPos0.value.add(v3)
		// Get uPos1 Lerp speed 
		v3.copy(this.instance.material.uniforms.uPos0.value)
		v3.sub(this.instance.material.uniforms.uPos1.value)
		v3.multiplyScalar(0.05)
		// Lerp the speed
		v3.sub(this.vel)
		v3.multiplyScalar(0.5)
		this.vel.add(v3)
		this.instance.material.uniforms.uPos1.value.add(this.vel)
		this.instance.material.uniforms.uVel.value = this.vel

		this.instance.material.uniforms.uYpos.value = 0;


		
		// if(this.timeline) {
		// 	this.progressEased += (this.progress - this.progressEased) * 0.1
		// 	this.timeline.progress(this.progressEased)
		// }
		// if(this.instance) {
		// 	this.instance.position.y = this.yPos
		// 	this.instance.material.uniforms.uYpos.value = this.yPos;
		// 	this.instance.rotation.z = Math.sin(this.yPos * 0.1)
		// 	this.instance.rotation.x = Math.sin(-this.yPos * 0.1)
		// }
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