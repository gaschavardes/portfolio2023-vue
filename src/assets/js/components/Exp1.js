import { Group } from 'three'
import Text from '../components/Text'
import MarchingCubes from '../components/MarchingCubes'
import { E } from '../utils'
import C from 'cannon'
import store from '../store'
import Wind from '../Wind'
import gsap from 'gsap'
// import { copyObjectDataTransforms } from '../utils'

export default class Exp1 extends Group {
	constructor() {
		super()
		// this.load()
		this.position.set(0, 0, -5)
		this.load()
		this.worldInit = 0
		this.renderOrder = 10
		this.isIn = false
		// store.RAFCollection.add(this.animate, 0)
		this.targetScroll = 0
		this.components = {
			text : new Text({
				way: store.isMobile ? 2 : 1, 
				posZ: -1.5,
				side: 1,
			}),
			text2 : new Text({
				way: store.isMobile ? -1.5 : -0.5, 
				posZ: -3,
				side: 0,
			}),
			bubble : new MarchingCubes()
		}
	}

	build() {
		store.world = new C.World()
		store.world.gravity.set(0, -10, 0)
		for (const key in this.components) {
			this.components[key].build(this.objectData)
			this.add(this.components[key])
		}
		this.addEvents()
		this.start()
		this.wind = new Wind(this.components.text.mesh)
		gsap.to(this, { worldInit: 10, duration: 3, onUpdate: () => {
			store.world.step(1 / 60);
			this.components.text.applyWind(this.wind)
			this.components.text2.applyWind(this.wind)
			this.components.text.animate()
			this.components.text2.animate()
		}})

	}

	addEvents() {
		E.on('bubbleEnter', (e) => {
			this.enter(e)
		})
		E.on('bubbleLeave', (e) => {
			this.leave(e)
		})
	}

	removeEvents() {
		E.off('bubbleEnter', (e) => {
			this.enter(e)
		})
		E.off('bubbleLeave', (e) => {
			this.leave(e)
		})
		store.RAFCollection.remove(this.animate)
	}

	enter(e){
		if(this.isIn) return
		this.isIn = true
		store.RAFCollection.add(this.animate)
		for (const key in this.components) {
			this.components[key].enter && this.components[key].enter(e)
		}
	}
	leave(e){
		if(!this.isIn) return
		this.isIn = false
		store.RAFCollection.remove(this.animate)
		for (const key in this.components) {
			this.components[key].leave && this.components[key].leave(e)
		}
	}
	stop(){
		this.isIn = false
		for (const key in this.components) {
			this.components[key].leave && this.components[key].stop()
		}
		this.removeEvents()
	}
	start(){
		for (const key in this.components) {
			this.components[key].leave && this.components[key].start()
		}
		this.addEvents()
	}

	setWind() {

	}


	load() {

	}
	animate = () => {
		this.wind.update()
		this.components.text.applyWind(this.wind)
		this.components.text2.applyWind(this.wind)
		store.world.step(1 / 60);
	}
}