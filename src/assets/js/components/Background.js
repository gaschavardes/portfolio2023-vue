import { Mesh, Color, PlaneGeometry} from 'three'
import { BackgroundMaterial } from '../materials'
import store from '../store'
import gsap from 'gsap'
import { E } from '../utils'
// import { copyObjectDataTransforms } from '../utils'

export default class Background extends Mesh {
	constructor() {
		super(
			new PlaneGeometry(),
			new BackgroundMaterial({
			})
		)

		this.position.set(0, 0, -20)
		this.scale.setScalar(100)
		this.globalUniforms = {
			uColor: { value: new Color(0xf3ff8f) },
		}
		this.renderOrder = 1
		this.appaearProgress = 0
		this.load()
	}

	build() {
		// this.setFluid()
		// this.envText = new Texture()
		this.material.uniforms.uMap.value = store.MainScene.backgroundTexture
		// this.material.uniforms.envFbo.value = store.simFbo.texture
		console.log(store.MainScene.backgroundTexture)

		E.on('LoaderOut', () => {
			gsap.fromTo(this, { appearProgress: 0 }, {
				appearProgress: 2,
				repeat: 0,
				delay: 0.5,
				duration: 2,
				ease: 'power1.easeInOut',
				onUpdate: () => {
					this.material.uniforms.uAppear.value = this.appearProgress
					
				}
			})
		})
	}

	mouseMove = () => {
		
	}

	animate = () => {
		
		this.material.uniforms.uTime = store.WebGL.globalUniforms.uTime
	}

	load() {
		this.assets = {
			models: {},
			textures: {}
		}
	}
}