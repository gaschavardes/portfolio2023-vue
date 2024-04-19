// First, I'm going to set 2 local constants
import { Clock, Vector3 } from 'three'
import { createNoise3D } from 'simplex-noise';
const baseForce = 30;
const off = 0.05;

const noise = new createNoise3D()

export default class Wind {
    constructor(figure) {
        const { count } = figure.geometry.attributes.position;
        this.figure = figure;
        
        // Like the mass, I don't want to have too much forces applied because of a large amount of vertices
        this.force = baseForce / count;

        // We'll use the clock to increase the wind movement
        this.clock = new Clock();

        // Just a base direction
        this.direction = new Vector3(0.5, 0.5, 0);
        
        // My array 
        this.flowfield = new Array(count);

        // Where all will happen!
        this.update()
    }
	update() {
		const time = this.clock.getElapsedTime();
	
		const { position } = this.figure.geometry.attributes;
		const size = this.figure.geometry.parameters.widthSegments;
	
		for (let i = 0; i < position.count; i++) {
			const col = i % (size + 1);
			const row = Math.floor(i / (size + 1));
	
			const force = (noise(row * off, col * off, time) * 0.5 + 0.5) * this.force;
	
			this.flowfield[i] = this.direction.clone().multiplyScalar(force);
		}
	}
}
