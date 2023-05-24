import { Group, PlaneGeometry, Mesh, Vector2} from 'three'
import { GradientMaterial } from '../materials'
import Simulation from './Simulation/Simulation'
import store from '../store'
// import { copyObjectDataTransforms } from '../utils'

export default class Sim extends Group {

	build() {
		this.simulation = new Simulation();

        this.output = new Mesh(
            new PlaneGeometry(2, 2),
			new GradientMaterial({
				waterTexture: {
					value: this.simulation.fbos.vel_1.texture
				},
				boundarySpace: {
					value: new Vector2(0, 0)
				}
			})
            // new THREE.RawShaderMaterial({
            //     vertexShader: face_vert,
            //     fragmentShader: color_frag,
            //     uniforms: {
            //         velocity: {
            //             value: this.simulation.fbos.vel_0.texture
            //         },
            //         boundarySpace: {
            //             value: new THREE.Vector2()
            //         }
            //     },
            // })
        );
		this.output.scale.setScalar(100)
		this.output.position.z = -10
		this.add(this.output)
		store.RAFCollection.add(this.animate, 0)
	}

	animate = () => {
		this.simulation.update()
		store.WebGL.renderer.setRenderTarget(null);
		store.WebGL.renderer.render(store.MainScene, store.MainScene.camera)
	}

	load() {
		this.assets = {
			models: {},
			textures: {}
		}
	}
}