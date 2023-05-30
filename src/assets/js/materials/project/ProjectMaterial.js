import { Color, RawShaderMaterial } from 'three'
import { mergeDeep } from '../../utils'
import store from '../../store'
import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export default class ProjectMaterial extends RawShaderMaterial {
	constructor(options = {}) {
		console.log(options.globalUniforms)
		options = mergeDeep(
			{
				uniforms: {
					uColor: { value: new Color(0xffffff) },
					uResolution: options.uniforms.resolution,
					uTime: store.WebGL.globalUniforms.uTime,
					uMap: options.uniforms.map

				},
				defines: {
				}
			}, options)

		super({
			vertexShader,
			fragmentShader,
			uniforms: options.uniforms,
			defines: {
			}
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