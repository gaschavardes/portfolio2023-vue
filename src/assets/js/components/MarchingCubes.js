import {MarchingCubes} from 'three/examples/jsm/objects/MarchingCubes';
import { Mesh, WebGLRenderTarget, Vector2} from 'three/src/Three'
import { DropMaterial, BackDropMaterial } from '../materials'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import store from '../store'
import gsap from 'gsap'
export default class Drop extends Mesh {
	constructor(){
		super()
		this.tick = 0
		this.introVal = 7
		this.way = 1
		this.load()
	}

	build() {
		// this.tick = 0
		this.envFbo = new WebGLRenderTarget(
			store.window.w * store.WebGL.renderer.getPixelRatio(),
			store.window.h * store.WebGL.renderer.getPixelRatio()
		)

		this.fboCreate()


		const resolution = 80;
		this.material = this.dropMaterial
		this.effect = new MarchingCubes( resolution, this.material, true, true, 10000);
		this.effect.position.set( 0, 0, 0 );

		this.effect.enableUvs = true;
		this.effect.enableColors = true;


		this.effectController = {

			speed: 1.0,
			numBlobs: 10,
			resolution: 1,
			isolation: 0,

			floor: false,
			wallx: false,
			wallz: false,

			dummy: function () {}

		};

		this.effect.position.set(0, 0, 12)

		if(store.isMobile) {
			this.effect.scale.set(7, 7, 4.)
		} else {
			this.effect.scale.set(10, 10, 4.)
		}
		this.add( this.effect );
		E.on(GlobalEvents.RESIZE, this.onResize)
		
	}

	fboCreate() {
		this.backfaceFbo = new WebGLRenderTarget(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.dropMaterial = new DropMaterial({
			envMap: this.envFbo.texture,
			resolution: [store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio()],
			backfaceMap: this.backfaceFbo.texture,
			matcap: this.matCap,
			progress: 0,
			fresnelVal: 0.8,
			refractPower: 1.5,
			uMap: store.LabScene.backgroundTexture
		})
		this.backdropMaterial = new BackDropMaterial()
	}

	enter(e) {
		this.way = e.value
		if(this.leaveAnim) this.leaveAnim.kill()
		store.RAFCollection.add(this.animate)
		this.appearAnim = gsap.to(this, {introVal: 0.8, duration: 3})
	}
	leave(e) {
		this.way = e.value
		if(this.appearAnim) this.appearAnim.kill()
		this.leaveAnim = gsap.to(this, {introVal: 7, duration: 3, onComplete: () => {
			store.RAFCollection.remove(this.animate)
		}})
	}
	stop() {
		this.way = 1
		gsap.set(this, {introVal: 7})
		this.animate()
		if(this.leaveAnim) this.leaveAnim.kill()
		if(this.appearAnim) this.appearAnim.kill()
		store.RAFCollection.remove(this.animate)
	}
	start() {
		this.way = 1
		gsap.set(this, {introVal: 7})
		this.animate()
	}

	updateCubes( object, time, numblobs, floor, wallx, wallz ) {

		object.reset();
		// fill the field with some metaballs

		// const rainbow = [
		// 	new Color( 0xff0000 ),
		// 	new Color( 0xffbb00 ),
		// 	new Color( 0xffff00 ),
		// 	new Color( 0x00ff00 ),
		// 	new Color( 0x0000ff ),
		// 	new Color( 0x9400bd ),
		// 	new Color( 0xc800eb )
		// ];
		const subtract = 12;
		const strength = .5 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 );

		for ( let i = 0; i < numblobs; i ++ ) {

			let ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) )  + i * Math.PI * 0.2) * this.introVal * 0.1 + 0.5 ;
			let bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) )) * 0.1 + 0.45 - (this.introVal - 0.8) * 0.1 * this.way ; // dip into the floor
			let ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.1 + 0.5 ;

			// const ballx = 0.5;
			// const bally = 0.5;
			// const ballz = 0.5;
			// if ( current_material === 'multiColors' ) {

			// 	object.addBall( ballx, bally, ballz, strength, subtract, rainbow[ i % 7 ] );

			// } else {

			// 	object.addBall( ballx, bally, ballz, strength, subtract );

			// }

			// if(i === numblobs - 1) {
			// 	ballx = 0.5 + Math.sin(time * 0.5) * 0.3;
			// 	bally = 0.5 + Math.cos(time * 0.2) * 0.3;
			// 	ballz = 0.5;
			// }

			object.addBall( ballx, bally, ballz, strength, subtract );


		}

		if ( floor ) object.addPlaneY( 2, 12 );
		if ( wallz ) object.addPlaneZ( 2, 12 );
		if ( wallx ) object.addPlaneX( 2, 12 );

		object.update();

	}

	animate = () => {
		this.tick++
		this.updateCubes( this.effect, store.WebGL.globalUniforms.uTime.value, this.effectController.numBlobs, this.effectController.floor, this.effectController.wallx, this.effectController.wallz );


		this.effect.visible = false
		store.WebGL.renderer.setRenderTarget(this.envFbo)
		store.WebGL.renderer.render(store.LabScene, store.LabScene.camera)
		this.effect.visible = true

		store.WebGL.renderer.setRenderTarget(null)
		this.effect.material = this.backdropMaterial
		store.WebGL.renderer.setRenderTarget(this.backfaceFbo)
		store.WebGL.renderer.render(store.LabScene, store.LabScene.camera)

		store.WebGL.renderer.setRenderTarget(null)

		this.effect.material = this.dropMaterial
		this.effect.material.uniforms.uTime.value = store.WebGL.globalUniforms.uTime.value
	}

	load = () => {
		store.AssetLoader.loadTexture(`/textures/cosmo3.png`).then(texture => {
			this.matCap = texture
		})
	}
	onResize = () => {
		this.dropMaterial.uniforms.resolution.value = new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.envFbo.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		this.backfaceFbo.setSize(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
	}
}