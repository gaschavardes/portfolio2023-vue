import { ShaderMaterial, Vector2 } from "three"
import transitionVert from '../materials/transition/transitionVert.glsl'
import transitionFrag from '../materials/transition/transitionFrag.glsl'
import store from "../store"
import gsap from "gsap"
import { E } from "../utils"
import GlobalEvents from '../utils/GlobalEvents'
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"

export default class SceneTransition {
	constructor(options = {}) {
		this.fromSceneKey = options.fromScene
		this.toSceneKey = options.toScene
		this.shaderKey = options.fromScene.concat(`-${options.toScene}`)
		this.index = options.index || 100

		this.origDuration = options.duration
		this.duration = options.duration
		this.setTransitionThresholds()
		E.on(GlobalEvents.RESIZE, this.onResize)
	}

	setTransitionThresholds() {
		// If you change these, change them in space and sky scene, too! (toNext in space and toPrev in sky!)
		this.toNextThreshold = 0.68
		this.toPrevThreshold = 0.08
	}

	build() {
		this.fromScene = store.WebGL.scenes[`${this.fromSceneKey}`]
		this.toScene = store.WebGL.scenes[`${this.toSceneKey}`]

		// Place to import custom shaders
		this.transitionShaders = {
			'space-sky': {
				frag: transitionFrag
			}
		}


		// Normal shader pass so transition still runs at 60fps
		this.transitionPass = new ShaderPass(new ShaderMaterial({
			vertexShader: transitionVert, // keep default
			fragmentShader: transitionFrag, // select correct shader
			uniforms: {
				uFromScene: { value: this.fromScene.savePass.renderTarget.texture },
				uToScene: { value: this.toScene.savePass.renderTarget.texture },
				uProgress: { value: 0 },
				uTime: store.WebGL.globalUniforms.uTime,
				uResolution: { value: new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())}
			},
			transparent: true
		}))
		this.transitionPass.name = `${this.shaderKey} Transition`
		this.transitionPass.enabled = true

		store.WebGL.composerPasses.add(this.transitionPass, 100) // Comes after scenes' save passes and before global effects such as lens halo
	}

	transition( way, duration = this.duration, reversed = false) {
		const sceneA = store.WebGL.scenes[`${this.fromSceneKey}`]
		const sceneB = store.WebGL.scenes[`${this.toSceneKey}`]
		if (store.currentTrans?.isActive()) return

		store.WebGL.activeTransition = true


		store.currentTrans = gsap.timeline()
		store.currentTrans.to(this.transitionPass.material.uniforms.uProgress, 
		{
			runBackwards: reversed,
			value: way,
			duration: duration,
			ease: 'power2.inOut',
			onStart: () => {
				store.targetScene = sceneB.name
				store.leavingScene = sceneA.name
				sceneB.renderPass.enabled = true
				sceneA.savePass.enabled = true
				sceneB.savePass.enabled = true

				this.transitionPass.enabled = true
				this.transitionPass.activeTransition = true

				sceneA.activeTransition = true
				sceneB.activeTransition = true

				sceneA.bloomPass.enabled = true
				sceneB.bloomPass.enabled = true

				if(way === 1) {
					sceneB.start()
				} else {
					sceneA.start()
				}
			},
			onComplete: () => {
				// sceneA.stop()
				// console.log(nextPage)
				store.leavingScene = ''

				// Disable all passes apart from the render pass of the transitioned scene
				if(way === 1) {
					sceneA.stop()
					sceneA.bloomPass.enabled = false
					sceneA.renderPass.enabled = false
					sceneB.renderPass.enabled = true
					store.WebGL.activeScene = sceneB
					sceneA.savePass.enabled = false
					sceneB.savePass.enabled = false

					this.transitionPass.enabled = false
					this.transitionPass.activeTransition = true

					// // End transitioning period
					sceneA.activeTransition = false
					sceneB.activeTransition = false
				} else {
					sceneB.stop()
					sceneB.bloomPass.enabled = false
					sceneB.renderPass.enabled = false
					sceneA.renderPass.enabled = true
					store.WebGL.activeScene = sceneB
					sceneB.savePass.enabled = false
					sceneA.savePass.enabled = false

					this.transitionPass.enabled = false
					this.transitionPass.activeTransition = true

					// // End transitioning period
					sceneB.activeTransition = false
					sceneA.activeTransition = false
				}
				

				// this.setAdditionalOnComplete(reversed)

				E.emit('transitionComplete')

			}
		}, 0)
	}
	onResize = () => {
		this.transitionPass.uniforms.uResolution.value = new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
	}
}