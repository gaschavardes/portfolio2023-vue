import { Color, Group, Mesh, PlaneGeometry, Vector3, RepeatWrapping} from 'three'
import { RibonMaterial } from '../materials';
import store from '../store'
import C from 'cannon'
import { E } from '../utils'
import gsap from 'gsap'
// import { copyObjectDataTransforms } from '../utils'

export default class Text extends Group {
	constructor(options) {
		super()
		// this.load()
		this.options = options
		this.side = options.side
		this.position.set(0, 0, 0)
		// this.scale.setScalar(2)
		this.renderOrder = 1
		this.appaearProgress = 0
		this.load()
		this.size = { x: 20, y: 10}
		this.targetScroll = 0
		this.mass = 1
		this.bufferV = new C.Vec3();

	}

	build() {
		this.setElm()
	}

	setElm(){
		this.setText()
	}

	initWorld() {
		
		this.createStitches()

		E.on('LoaderOut', () => {
			
		})
	}

	setText() {
		this.geometry = new PlaneGeometry(20, 1, this.size.x, this.size.y)
		this.material = new RibonMaterial({
			uMap: this.texture,
			uSide: this.side
		}),
		this.material.color = new Color(0xF0F0F0)
		this.mesh = new Mesh(this.geometry, this.material)
		this.add(this.mesh)
		this.mesh.scale.set(3, 3, 3)
		this.position.z = this.options.posZ
		this.mesh.rotation.z = this.options.way * Math.PI / 6;
		this.geometry.computeBoundingBox();
		// const center = this.geometry.boundingBox.getSize(new Vector3());
		this.sizes = this.geometry.boundingBox.getSize(new Vector3())
		// this.mesh.position.set(-center.x * 0.5, 0, -1 );
		this.initWorld()

	}

	createStitches() {
		// We don't want a sphere nor a cube for each point of our cloth. Cannon provides the Particle() object, a shape with ... no shape at all!
		const particleShape = new C.Particle();
		const { position } = this.geometry.attributes;
		const { x: width, y: height } = this.sizes;
		this.stitches = [];
		this.movingPoints = [];
		for (let i = 0; i < position.count; i++) {
			// const row = Math.floor(i / (this.size + 1));
			const col = i % (this.size.x + 1);


			const pos = new C.Vec3(
				position.getX(i) * width,
				position.getY(i) * height,
				position.getZ(i)
			);
			let mass = 2
			if(col === 0 || col === this.size.x){
				mass = 0
				this.movingPoints.push(i)
			}

			

			const stitch = new C.Body({
				// We divide the mass of our body by the total number of points in our mesh. This way, an object with a lot of vertices doesn’t have a bigger mass. 
				mass: mass === 0 ? 0 : this.mass / position.count,
				// Just for a smooth rendering, you can drop this line but your cloth will move almost infinitely.
				linearDamping: 0.8,
				
				position: pos,
				shape: particleShape,
		
				// TEMP, we’ll delete later
				velocity: new C.Vec3(0, 0, -30)
			});
	
			this.stitches.push(stitch);
			store.world.addBody(stitch);
		}
		for (let i = 0; i < position.count; i++) {
			const col = i % (this.size.x + 1);
			const row = Math.floor(i / (this.size.x));
		
			if (col < this.size.x) this.connect(i, i + 1, 'col');
			if (row < this.size.y) this.connect(i, i + this.size.x + 1, 'row');
		}
	}

	applyWind(wind) {
		const { position } = this.geometry.attributes;
	
		for (let i = 0; i < position.count; i++) {
			const stitch = this.stitches[i];
	
			const windNoise = wind.flowfield[i];
			const tempPosPhysic = this.bufferV.set(
				windNoise.x,
				windNoise.y,
				windNoise.z
			);
	
			stitch.applyForce(tempPosPhysic, C.Vec3.ZERO);
		}
	}


	mouseMove = () => {
		
	}

	enter() {
		store.RAFCollection.add(this.animate)
		gsap.to(this.mesh.material.uniforms.uAppear, { value: 1, duration: 1.5, ease: 'power2.inOut'})
	}
	leave() {
		gsap.to(this.mesh.material.uniforms.uAppear, { value: 0, duration: 1, ease: 'power2.inOut',
			onComplete: () => {
				store.RAFCollection.remove(this.animate)
			}
		})
	}
	// leave(e) {
	// 	// this.way = e.value
	// 	// if(this.appearAnim) this.appearAnim.kill()
	// 	// this.leaveAnim = gsap.to(this, {introVal: 7, duration: 3, onComplete: () => {
	// 	store.RAFCollection.remove(this.animate)
	// 	// }})
	// }
	stop() {
		// store.RAFCollection.remove(this.animate)
		gsap.set(this.mesh.material.uniforms.uAppear, { value: 0})
		store.RAFCollection.remove(this.animate)
	}
	start() {
		// store.RAFCollection.add(this.animate)
		// store.RAFCollection.add(this.animate)
	}

	animate = () => {
		// store.world.gravity.set(0, -10 + Math.sin(t) * 20, 0)
		this.updatePhysics();
		// if(this.mesh) this.mesh.rotation.set(0, store.WebGL.globalUniforms.uTime.value, store.WebGL.globalUniforms.uTime.value)
	}

	updatePhysics() {
		//MESH UPDATE
		const { position } = this.geometry.attributes;
		const { x: width, y: height } = this.sizes;

		for (let i = 0; i < position.count; i++) {
			position.setXYZ(
				i,
				this.stitches[i].position.x / width,
				this.stitches[i].position.y / height,
				this.stitches[i].position.z
			);
		}

		// this.mesh.geometry.computeFaceNormals();
		this.mesh.geometry.computeVertexNormals();

		// this.movingPoints.forEach(el => {
		// 	position.setXYZ(
		// 		el,
		// 		this.stitches[el].position.x / width,
		// 		this.stitches[el].position.y / height + Math.sin(t),
		// 		this.stitches[el].position.z
		// 	);
		// })

		position.needsUpdate = true;
		// We need this to synchronize three meshes and Cannon.js rigid bodies
		// this.menu.update()

		// As simple as that!
		// store.world.step(1 / 60);
	}	
	connect(i, j, type) {
		const c = new C.DistanceConstraint(this.stitches[i], this.stitches[j]);
		if(type === 'row'){
			c.distance *= 0.8;
		} else {
			c.distance *= 0.8;
		}

		store.world.addConstraint(c);
	}

	load() {
		store.AssetLoader.loadTexture(`/textures/the-drop.png`, { flipY: true, wrapping: RepeatWrapping}).then(texture => {
			// texture.repeat = new Vector2(10, 1);
			this.texture = texture
		})
	
		this.assets = {
			models: {},
			textures: {}
		}
	}
}