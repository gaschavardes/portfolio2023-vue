import { Color, Group, Mesh, MeshBasicMaterial, Vector3} from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import store from '../store'
import C from 'cannon'
// import { copyObjectDataTransforms } from '../utils'

export default class Text extends Group {
	constructor() {
		super()
		// this.load()
		this.position.set(0, 0, 0)
		this.scale.setScalar(2)
		this.renderOrder = 1
		this.appaearProgress = 0
		this.load()
		store.RAFCollection.add(this.animate, 0)
		this.targetScroll = 0

	}

	build() {
		this.initWorld()
	}

	initWorld() {
		this.world = new C.World()
		this.world.gravity.set(0, -50, 0)
	}

	setText() {
		this.geometry = new TextGeometry( 'THE DROP', {
			font: this.font,
			size: 1,
			height: 0,
			curveSegments: 10,
			bevelEnabled: false,
			bevelThickness: 1,
			bevelSize: 0,
			bevelOffset: 0,
			bevelSegments: 1
		}),
		this.material = new MeshBasicMaterial({
			color: new Color("0xEEEEEE")
		}),
		this.material.color = new Color(0xF0F0F0)
		this.mesh = new Mesh(this.geometry, this.material)
		this.add(this.mesh)

		this.geometry.computeBoundingBox();
		const center = this.geometry.boundingBox.getSize(new Vector3());
		this.mesh.position.set(-center.x * 0.5, 0, -1 );
		console.log('KIKOULOL', this.mesh)
	}


	mouseMove = () => {
		
	}

	animate = () => {
		// if(this.mesh) this.mesh.rotation.set(0, store.WebGL.globalUniforms.uTime.value, store.WebGL.globalUniforms.uTime.value)
	}	

	load() {
		const fontLoader = new FontLoader()

		fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
			this.font = font
			this.setText()
		})
		this.assets = {
			models: {},
			textures: {}
		}
	}
}