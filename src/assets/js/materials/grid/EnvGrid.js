import { Color, DoubleSide, ShaderMaterial, Vector2, Vector3 } from 'three'
import { mergeDeep } from '../../utils'
import store from '../../store'
import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export default class BasicMaterial extends ShaderMaterial {
	constructor(options = {}) {
		options = mergeDeep(
			{
				uniforms: {
					uColor: { value: new Color(0x0000FF) },
					tDiffuse: {value: options.envMap},
					resolution: { value: options.resolution},
					uTime: store.WebGL.globalUniforms.uTime,
					uPos0: {value: new Vector2()},
					uPos1: {value: new Vector3(0,0,0)},
					uAnimate: {value: 0},
					uVel: { value: 0},
					backfaceMap: { value: options.backfaceMap },
					tNormal: { value: options.tNormal},
					normalMap: { value: options.tNormal},
					tMatcap: { value: options.tMatCap},
					matCapMap: { value: options.tMatCap},
					uNormalStrength: { value: 1},
					uNormalScale: { value: 1},
					uBlendMode: { value: 1},
					uRoughness: { value: 0 },
					uDiffuseMatcapBlend: { value: 0.5 },
					uEnvMapBlend: { value: 0}
				},
				defines: {
					// USE_INSTANCING: true,
					SPECIAL_NORMAL: true,
					USE_NORMAL: true,
					USE_MATCAP: true,
					USE_ROUGH: true,
					// DOUBLE_SIDED: true

				}
			}, options)

		super({
			vertexShader,
			fragmentShader,
			uniforms: options.uniforms,
			defines: options.defines,
			transparent: true,
			depthTest: true,
			depthWrite: true
		})

		this.globalUniforms = options.globalUniforms
		this.uniforms = Object.assign(this.uniforms, this.globalUniforms)
	}

	/*
		Ensure correct cloning of uniforms with original references
	*/
	clone(uniforms) {
		const newMaterial = super.clone()
		newMaterial.uniforms = Object.assign(newMaterial.uniforms, this.globalUniforms)
		newMaterial.uniforms = Object.assign(newMaterial.uniforms, uniforms)
		return newMaterial
	}
}