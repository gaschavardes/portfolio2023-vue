import { ShaderMaterial, Vector2} from 'three'
import { mergeDeep } from '../../utils'
import store from '../../store'
import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export default class DropMaterial extends ShaderMaterial {
	constructor(options = {}) {
		options = mergeDeep(
			{
				uniforms: {
					uColor: { value: options.color },
					envMap: { value: options.envMap },
					// uMap: {value: options.uMap},
					resolution: { value: new Vector2(options.resolution[0], options.resolution[1]) },
					backfaceMap: { value: options.backfaceMap },
					// normalMap: { value: options.normalMap },
					uTime: { value: store.WebGL.globalUniforms.uTime.value },
					uFresnelVal: { value: options.fresnelVal },
					uRefractPower: { value: options.refractPower },
					uBlendMode: { value: 4},
					uDiffuseMatcapBlend: { value : .5},
					tMatcap: {value: options.matcap}
				},
				defines: {
					REFRACT: true,
					USE_NORMAL: true,
					USE_MATCAP: true,
				}
			}, options)

		super({
			vertexShader,
			fragmentShader,
			uniforms: options.uniforms,
			defines: options.defines
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