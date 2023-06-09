import { Color, RawShaderMaterial, Vector2 } from 'three'
import { mergeDeep } from '../../utils'
import store from '../../store'
import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export default class BasicMaterial extends RawShaderMaterial {
	constructor(options = {}) {
		options = mergeDeep(
			{
				uniforms: {
					uColor: { value: new Color(0xffffff) },
					envFbo: { value: null },
					uMap: { value: null },
					resolution: { value: new Vector2(store.window.w, store.window.h) },
					uTime: store.WebGL.globalUniforms.uTime,
					uAppear: { value: 0},
					uScroll: { value: 0}
				},
				defines: {
				}
			}, options)

		super({
			vertexShader,
			fragmentShader,
			uniforms: options.uniforms,
			defines: options.defines,
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