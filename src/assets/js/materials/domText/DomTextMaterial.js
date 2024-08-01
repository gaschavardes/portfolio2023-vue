import { Color, RawShaderMaterial, Vector2 } from 'three'
import { mergeDeep } from '../../utils'
import store from '../../store'
import vertexShader from './vert.glsl'
import fragmentShader from './frag.glsl'

export default class DomTextMaterial extends RawShaderMaterial {
	constructor(options = {}) {
		console.log(options)
		options = mergeDeep(
			{
				uniforms: {
					uTexture: options.uniforms.uTexture,
					uColor: { value: new Color(0xffffff) },
					uResolution: {value: new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())},
					uTime: store.WebGL.globalUniforms.uTime,
					uSpriteSize: options.uniforms.spriteSize,
					uHoverValY: { value: -10},
					uHoverValH: { value: 0},
					uYpos: {value: 0},
					uScroll: { value: 0},
					uMaxScroll: options.uniforms.uMaxScroll,
					uMaxWidth: options.uniforms.uMaxWidth,
					uMaxUv: options.uniforms.uMaxUv,
					uHoverProgress: { value: 50},
					uShadow: { value: 1},
					uDisplaceVal: { value: 1}
				},
				defines: {
				}
			}, options)


		super({
			vertexShader,
			fragmentShader,
			uniforms: options.uniforms,
			defines: options.defines,
			toneMapped: true,
			transparent: true,
			depthWrite: false,
			// blending: AdditiveBlending,
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