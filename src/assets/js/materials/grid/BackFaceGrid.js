import { ShaderMaterial, BackSide, Vector2, Vector3 } from 'three'
import vertexShader from './vert.glsl'
import fragmentShader from './backFrag.glsl'
// import { mergeDeep } from '../../utils'
import store from '../../store'

export default class BackFaceGrid extends ShaderMaterial {
	constructor(options = {}) {
		// options = mergeDeep(
		// 	{
		// 		defines: {
		// 			USE_INSTANCE: true
		// 		}
		// 	}
		// )
		super({
			vertexShader,
			fragmentShader,
			side: BackSide,
			uniforms: {
				uTime: store.WebGL.globalUniforms.uTime,
				uPos0: {value: new Vector2()},
				uPos1: {value: new Vector3(0,0,0)},
				uAnimate: {value: 0},
				uVel: { value: 0},
				tNormal: { value: options.tNormal}
			}
		})
	}
}