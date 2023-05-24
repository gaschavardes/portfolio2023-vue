import { ShaderMaterial, BackSide } from 'three'
import vertexShader from './vert.vert'
import fragmentShader from './frag.frag'

export default class BackFaceMaterial extends ShaderMaterial {
	constructor() {
		super({
			vertexShader,
			fragmentShader,
			side: BackSide,
			uniforms: {
				uTime: { value: 0 },
				uProgress: { value: 0 },
				uStartingTime: { value: 0 },
				uAppear: { value: 0 }
			}
		})
	}
}