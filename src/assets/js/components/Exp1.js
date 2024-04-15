import { Group } from 'three'
import Text from '../components/Text'
import MarchingCubes from '../components/MarchingCubes'
import { E } from '../utils'
// import store from '../store'
// import { copyObjectDataTransforms } from '../utils'

export default class Exp1 extends Group {
	constructor() {
		super()
		// this.load()
		this.position.set(0, 0, -5)
		this.load()
		// store.RAFCollection.add(this.animate, 0)
		this.targetScroll = 0
		this.components = {
			text : new Text(),
			bubble : new MarchingCubes()
		}

	}

	build() {
		console.log('BUILD')
		for (const key in this.components) {
			this.components[key].build(this.objectData)
			this.add(this.components[key])
		}
		this.addEvents()
	}

	addEvents() {
		console.log('ADD EVENTS')
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
	}

	enter(e){
		for (const key in this.components) {
			this.components[key].enter && this.components[key].enter(e)
		}
	}
	leave(e){
		console.log('leave')
		for (const key in this.components) {
			this.components[key].leave && this.components[key].leave(e)
		}
	}
	stop(){
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


	load() {

	}
}