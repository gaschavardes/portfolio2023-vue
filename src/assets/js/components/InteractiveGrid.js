import { Group, WebGLRenderTarget, InstancedBufferAttribute, InstancedMesh, Object3D, Raycaster, PlaneGeometry, Mesh, Vector2, MeshBasicMaterial } from 'three'
import { GridMaterial, BackFaceGrid, TokenMaterial, BackFaceToken } from '../materials'
import store from '../store'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import gsap from 'gsap'
export default class InteractiveGrid extends Group {
	constructor() {
		super()
		this.vel = new Vector2()
		this.load()
	}
	build() {
		this.createGrid()
		this.createSingle()
		this.mouseInteraction()
		// store.RAFCollection.add(this.onRaf.bind(this), 0)
		this.rotation.set(-.5, 0, 0)
		this.position.set(0, 0, -5)
		E.on(GlobalEvents.RESIZE, this.onResize)
		E.on('App:start', () => {
			this.appear()
		})
		E.on('introProgress', (e) => {
			this.introLeave(e.value)
		})
	}

	appear() {
		this.appearTimeline = gsap.timeline({ paused: true })
		this.appearTimeline.addLabel('tokenAppear')
		this.appearTimeline.fromTo(this.tokenMaterial.uniforms.uAppear, { value: 0}, { value: 2, duration: 4}, 'tokenAppear')
		this.appearTimeline.to(this.token.rotation, { z: Math.PI * 2, duration: 1}, 'tokenAppear+=0.5')
		this.appearTimeline.to(this.token.position, { y: 0, z: 4, duration: 1.2, ease: "back.out(5)"}, 'tokenAppear+=0.5')

		this.appearTimeline.addLabel('gridAppear', '-=2')
		this.appearTimeline.fromTo(this.gridMaterial.uniforms.uAppear, { value: 0},
			{ 
				value: 30,
				duration: 2,
				onUpdate: () => {
					this.backfaceMaterial.uniforms.uAppear.value = this.gridMaterial.uniforms.uAppear.value
				}
		}, 'gridAppear-=.5')
		
		this.tokenLeaveTimeline = gsap.timeline({ paused: true })
		this.tokenLeaveTimeline.to(this.token.position, { y: 5.8, duration: 1.2}, 0)
		this.tokenLeaveTimeline.to(this.tokenMaterial.uniforms.uIOR, { value: 1, duration: 1.2}, 0)
		this.tokenLeaveTimeline.to(this.token.scale, { x: 1, y: 1, z: 1, duration: 1.2}, 0)

	}

	introLeave(e) {
		this.tokenLeaveTimeline.progress(e)
		this.gridMaterial.uniforms.uLeave.value = e * 6
		this.backfaceMaterial.uniforms.uLeave.value = e * 6
		// this.backfaceTokenMaterial.uniforms.uLeave.value = e
		// this.token
		// this.gridMaterial.uniforms.uLeave.value = e
	}

	createGrid() {
		this._instanceDummy = new Object3D()
	
		const grid = 27
		const size = 0.5
		const offset = 1.3
		const gridSize = grid * size + offset * grid
		let i = 0
		// const geometry = new CylinderGeometry( size, size, 0.2, 32 ); 
		const geometry = this.token
		// const geometry = new BoxGeometry( size, size, size); 
		this.randoms = []
		this.backfaceFbo = new WebGLRenderTarget(store.window.w, store.window.h)
		this.envFbo = new WebGLRenderTarget(store.window.w, store.window.h)
		this.gridMaterial = new GridMaterial({
			backfaceMap: this.backfaceFbo.texture,
			envMap: this.envFbo.texture,
			tNormal: this.normalMap,
			tMatCap: this.matCap,
			resolution: new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		})
		this.backfaceMaterial = new BackFaceGrid({
			tNormal: this.normalMap,
		})
		this.items = new InstancedMesh(geometry, this.gridMaterial, grid * grid)
		this.items.castShadow = true;
		this.items.receiveShadow = true;
		for(let x = 0; x < grid; x++)
		for(let y = 0; y < grid; y++){
			this._instanceDummy.position.set( 
				x * size - gridSize /2 + size / 2. + offset * x, 
				y * size - gridSize/2 + size / 2. + offset * y,
				0, 
			);
			this.randoms.push(Math.random() * 5)

			this._instanceDummy.scale.set(0.7, 0.7, 0.7)
			this._instanceDummy.updateMatrix()
			this.items.setMatrixAt(i, this._instanceDummy.matrix)
			i++;
		}
		this.items.geometry.setAttribute(
			'random',
			new InstancedBufferAttribute(new Float32Array(this.randoms), 1)
		)
		this.items.instanceMatrix.needsUpdate = true;
		this.items.computeBoundingSphere();
		this.add(this.items)
	}


	createSingle() {
		const geometry = this.token
		this.backfaceTokenFbo = new WebGLRenderTarget(store.window.w, store.window.h)
		this.envTokenFbo = new WebGLRenderTarget(store.window.w, store.window.h)
		this.tokenMaterial = new TokenMaterial({
			backfaceMap: this.backfaceTokenFbo.texture,
			envMap: this.envTokenFbo.texture,
			tNormal: this.normalMap,
			tMatCap: this.matCapToken,
			resolution: new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		})
		this.backfaceTokenMaterial = new BackFaceToken({
			tNormal: this.normalMap,
		})
		this.token = new Mesh(geometry, this.backfaceTokenMaterial)
		this.token.rotation.set(Math.PI * 0.5, 0, 0)
		this.token.position.set(0, 0, -1)
		this.token.scale.set(2.5, 2.5, 2.5)
		store.LabScene.add(this.token)
	}
	mouseInteraction() {
		const hitplane = new Mesh(
			new PlaneGeometry(),
			new MeshBasicMaterial()
		) 
		hitplane.scale.setScalar(50)
		hitplane.position.set(0, 0, 0)
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
			raycaster.setFromCamera(v2, store.LabScene.camera)

			let intersects = raycaster.intersectObject(hitplane)

			if(intersects.length > 0){
				let first = intersects[0]
				this.mouse.x = first.point.x
				this.mouse.y = first.point.y
			}
		})
	}

	stop() {
		store.RAFCollection.remove(this.onRaf, 0)
		this.appearTimeline.seek(0)
		this.appearTimeline.pause()

		this.tokenLeaveTimeline.seek(0)
		this.tokenLeaveTimeline.pause()
		this.token.position.set(0, 0, -1)
		this.token.scale.set(2.5, 2.5, 2.5)
		this.gridMaterial.uniforms.uLeave.value = 0
		this.backfaceMaterial.uniforms.uLeave.value = 0

	}
	start() {
		store.RAFCollection.add(this.onRaf, 0)
		gsap.delayedCall(.5, () => {
			this.appearTimeline.play()
		})
	}

	onRaf = () => {
	
		// Lerp uPos0 to mouse
		let v3 = new Vector2()
		v3.copy(this.mouse)

		v3.sub(this.items.material.uniforms.uPos0.value)
		v3.multiplyScalar(0.1)
		this.items.material.uniforms.uPos0.value.add(v3)
		// Get uPos1 Lerp speed 
		v3.copy(this.items.material.uniforms.uPos0.value)
		v3.sub(this.items.material.uniforms.uPos1.value)
		v3.multiplyScalar(0.1)
		// Lerp the speed
		v3.sub(this.vel)
		v3.multiplyScalar(0.9)
		this.vel.add(v3)
		// Add the lerped velocity
		this.gridMaterial.uniforms.uVel.value = this.vel.length() *2
		this.gridMaterial.uniforms.uPos1.value.add(this.vel)
		
		if(this.tokenLeaveTimeline.progress() < 0.999){
		this.backfaceMaterial.uniforms.uVel.value = this.gridMaterial.uniforms.uVel.value
		this.backfaceMaterial.uniforms.uPos1.value = this.gridMaterial.uniforms.uPos1.value
		this.backfaceMaterial.uniforms.uPos0.value = this.gridMaterial.uniforms.uPos0.value

		this.tokenMaterial.uniforms.uPos0.value = this.gridMaterial.uniforms.uPos0.value
		this.backfaceTokenMaterial.uniforms.uPos0.value = this.gridMaterial.uniforms.uPos0.value

		this.items.material = this.backfaceMaterial
		store.WebGL.renderer.setRenderTarget(this.backfaceFbo)
		store.WebGL.renderer.render(store.LabScene, store.LabScene.camera)

		store.WebGL.renderer.setRenderTarget(null)
		this.gridMaterial.uniforms.envMap.value = this.envFbo.texture
		this.gridMaterial.depthTest = true
		this.gridMaterial.depthWrite = true
		this.gridMaterial.uniforms.uHideZ.value = 0

		this.items.visible = false
		this.token.visible = true
		this.items.material = this.gridMaterial
		this.gridMaterial.uniforms.uHideZ.value = 1
		this.gridMaterial.uniforms.envMap.value = this.envFbo.clone().texture
		store.WebGL.renderer.setRenderTarget(this.envFbo)
		store.WebGL.renderer.render(store.LabScene, store.LabScene.camera)
		this.items.visible = true

		} else {
			this.items.visible = false
		}
		

		this.token.material = this.backfaceTokenMaterial
		store.WebGL.renderer.setRenderTarget(this.backfaceTokenFbo)
		store.WebGL.renderer.render(store.LabScene, store.LabScene.camera)
		this.token.visible = false
		store.WebGL.renderer.setRenderTarget(this.envTokenFbo)
		store.WebGL.renderer.render(store.LabScene, store.LabScene.camera)


		store.WebGL.renderer.setRenderTarget(null)
		store.WebGL.renderer.render(store.LabScene, store.LabScene.camera)
		this.token.visible = true
		this.token.material = this.tokenMaterial
		this.gridMaterial.uniforms.envMap.value = this.envFbo.texture
		this.gridMaterial.depthTest = true
		this.gridMaterial.depthWrite = true
		this.gridMaterial.uniforms.uHideZ.value = 0
		// this.items.material = this.gridMaterial

		// this.token.rotation.z = store.WebGL.globalUniforms.uTime.value * 0.5
	}
	load() {
		store.AssetLoader.loadGltf(`/models/tokenThin.glb`).then(gltf => {
			// this.pieces = gltf.children
			this.token = gltf.scene.children[0].geometry
		})
		// store.AssetLoader.loadFbx(`/model/token.fbx`).then(gltf => {
		// 	// this.pieces = gltf.children
		// 	this.token = gltf.children[0].geometry
		// })
		store.AssetLoader.loadTexture(`/textures/tokenNormal1.png`, { flipY: false}).then(texture => {
			this.normalMap = texture
		})
		store.AssetLoader.loadTexture(`/textures/misc18.png`).then(texture => {
			this.matCap = texture
		})
		store.AssetLoader.loadTexture(`/textures/diamond1.png`).then(texture => {
			this.matCapToken = texture
		})
	}

	onResize = () => {
		this.backfaceFbo.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.envFbo.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())

		this.backfaceTokenFbo.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.envTokenFbo.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		
		this.gridMaterial.uniforms.resolution.value = [store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()]
		this.tokenMaterial.uniforms.resolution.value = [store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()]
		// this.backfaceMaterial.uniforms.resolution.value = [store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()]
	}
}