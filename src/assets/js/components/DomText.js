

import { Texture, Mesh, WebGLRenderTarget, Group, PlaneGeometry, Vector2, InstancedMesh, InstancedBufferAttribute, Object3D} from 'three'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import store from '../store'
import gsap from 'gsap'
import SplitText from '../utils/gsap/SplitText'
import { DomTextMaterial, HoverMaterial, NonHoverMaterial } from '../materials'
// import {TextTexture} from '../TextTexture'

gsap.registerPlugin(SplitText)
export default class DomText extends Group{
	constructor(){
		super()
		this.items = []
		this.images = []
		this.svg = []
		this.textOption = ['H2', 'P', 'A', 'SPAN', 'DIV']
		this.load()
		this.geometry = new PlaneGeometry()
		this.isAnimated = false
		this.squareOpacity = 1
		// this.material = new DomTextMaterial({
		// 	uResolution: new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		// })
		this.scale.set(1.13, 1.13, 0)

		this.position.set(0, 0, 0)
		this.setScale()
		console.log(store.MainScene.camera)


	
		this.adjustAscenderRatio = 0.13
	}

	setScale() {
	
		this.z = store.window.h / Math.tan(store.MainScene.camera.fov * Math.PI / 360) * 0.5;
		this.zScale = store.MainScene.camera.position.z / this.z

		this.scale.set(
			store.window.w * this.zScale, store.window.h * this.zScale, 1.0
		);
		
		// this.position.set(   
		// 	(0 + rect.width * 0.5 - store.window.w * 0.5) * this.zScale,
		// 	(0 - rect.height * 0.5 + store.window.h * 0.5) * this.zScale,
		// 	0.0
		// );
	}

	createParticle() {

		this.target = new WebGLRenderTarget(
			store.window.w * store.WebGL.renderer.getPixelRatio(),
			store.window.h * store.WebGL.renderer.getPixelRatio()
		)
		this.dummy = new Object3D()
		// const texture = store.MainScene.backgroundTexture
		// const image = texture.source.data

		
		const size = new Vector2(store.window.w * 0.05, store.window.h * 0.07 )
		
		const particles = []
		const aIDs = []
		const aUVIDs = []
		const step = 0.1
		for (let y = 0, y2 = size.y; y < y2; y = y + step) {
			for (let x = 0, x2 = size.x; x < x2; x = x + step) {
				// if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
					const particle = {
						x : (x - size.x * 0.5),
						y : (y - size.y * 0.5),
					};
					this.lastY = particle.y
				
					particles.push(particle);
					aIDs.push(x + 1)
					// aUVIDs.push(x % data.height)
					aUVIDs.push(x / step)
					aUVIDs.push(y / step)
				// }
			}
		}
		this.particleMaxY = (particles[particles.length - 1].y + step * 0.5 + Math.abs(particles[0].y - step * 0.5))
		this.particleMaxX = (particles[particles.length - 1].x + step * 0.5 + Math.abs(particles[0].x - step * 0.5))
		console.log(aUVIDs[aUVIDs.length - 1])
		// const color = []
		const random = []
		this.instance = new InstancedMesh(
			new PlaneGeometry(step, step),
			new DomTextMaterial({
				uniforms: {
					resolution: { value: new Vector2(store.window.w * store.window.dpr, store.window.h * store.window.dpr)},
					spriteSize: {value: new Vector2(size.x / step, size.y / step ) },
					uTexture: { value: null },
					uScroll : { value: 0},
					uMaxScroll: {value: this.particleMaxY},
					uMaxWidth: { value: this.particleMaxX },
					uMaxUv: { value: aUVIDs[aUVIDs.length - 1]}
				}
			}),
			particles.length
		)
		let scale = 1
		this.dummy.scale.set(scale,scale,1)
		particles.forEach((el, i) => {
			this.dummy.position.set(el.x * scale, el.y * scale, 0)
			this.dummy.updateMatrix()
			// color.push(...[el.color.x, el.color.y, el.color.z] )
			random.push(Math.random() * 100)
			this.instance.setMatrixAt(i, this.dummy.matrix)
		})
		this.instance.instanceMatrix.needsUpdate = true
		// this.instance.geometry.setAttribute('colorVal', new InstancedBufferAttribute(new Float32Array(color), 3))
		this.instance.geometry.setAttribute('random', new InstancedBufferAttribute(new Float32Array(random), 1))
		this.instance.geometry.setAttribute('aID', new InstancedBufferAttribute(new Float32Array(aIDs), 1))
		this.instance.geometry.setAttribute('aUVID', new InstancedBufferAttribute(new Float32Array(aUVIDs), 2))
		this.add(this.instance)
		this.instance.scale.set(1/ size.x, 1/size.y, 1)
		this.instance.position.set(0, 0, 0)
		
		this.instance.visible = true
		this.instance.layers.set(1)
	}

	createPlanes(){
		this.renderPlane1 = new Mesh(
			new PlaneGeometry(),
			new HoverMaterial({
				uniforms: {
					uTexture: this.target.texture
				}
			})
		)

		this.renderPlane = new Mesh(
			new PlaneGeometry(),
			new NonHoverMaterial({
				uniforms: {
					uTexture: this.target.texture
				}
			})
		)
		this.add(this.renderPlane1)
		this.renderPlane1.scale.setScalar(150)
		this.add(this.renderPlane)
		this.renderPlane.scale.setScalar(150)
	}


	build() {
		// this.setWords()
		

		this.addEvents()
		this.createParticle()
		this.createPlanes()
		store.RAFCollection.add(this.writeTexture, 0)
		this.setCanvas()


	}

	addEl(item){
		if(this.textOption.indexOf(item.el.nodeName) > -1 ){
			this.items.push({dom: item.el, opacity:item.opacity, x: item.x, y: item.y, id: item.id, hoverValue: 0, hoverValueTemp: 0})
			this.setWords(this.items[this.items.length - 1])
			this.LenisScroll = store.Lenis.scroll
			
			gsap.to(this.items[this.items.length - 1], {
				opacity: 1,
				x: 0,
				y: 0,
				duration: 0.5,
				delay: this.items[this.items.length - 1].id * 0.05,
				ease: 'power2.out',
				onUpdate: () => {
					
				}
			})
		} else if(item.el.nodeName === 'svg'){
			this.svg.push({dom: item.el, image: null, x: 0, y: 0, opacity: 1})
			this.setSvg(this.svg[this.svg.length - 1])
		} else {
			this.images.push({dom: item.el, opacity:item.opacity, x: item.x, y: item.y})
			this.setImage(this.images[this.images.length - 1])
			gsap.to(this.images[this.images.length - 1], { opacity: 1, onUpdate: () => {
				
			}})

		}
		
	}

	opacityChange(elm, val){
		this.items.forEach((el, i) => {
			if(el.dom === elm) {
				gsap.to(this.items[i], {opacity: val, duration: 0.1, onUpdate:() => {
					
				}})

			}
		})
	}

	hover(elm){
		this.items.forEach((el) => {
			if(el.dom === elm.el) {
				if(elm.val === 0){
					this.instance.material.uniforms.uDisplaceVal.value = 0;
					gsap.to(this, { squareOpacity: 0, duration: 0.3, onComplete: () => {
						el.hoverValue = 0
						this.squareOpacity = 1
						this.instance.material.uniforms.uDisplaceVal.value = 1;
					}})
				} else {
					this.squareOpacity = 1
					el.hoverValue = elm.val
				}
			}
		})
		// if(elm.val === 0){
		// 	gsap.to(this.instance.material.uniforms.uShadow, { value: 0, duration: 0.2, onComplete: () => {
		// 		el.hoverValue = 0
		// 	}})
		// } else {

		// }
		// gsap.delayedCall(0.1, () => {
		// 	gsap.to(this.instance.material.uniforms.uHoverProgress, { value: -100, duration: 1,
		// 		onStart: () => { this.isAnimated = true},
		// 		onComplete: () => { this.isAnimated = false},
		// 	})
		// })
		
	}

	hoverLeave(elm){
		this.items.forEach((el) => {
			if(el.dom === elm.el) {
				el.hoverValueTemp =elm.val
			}
		})
	}

	itemLeave(elm){
		if(this.textOption.indexOf(elm.nodeName) > -1 ){
			this.items.forEach((el, i) => {
				if(el.dom === elm) {
					gsap.to(this.items[i], {opacity: 0, duration: 0.5, onUpdate:() => {
					},
					onComplete: () => {
						this.remove(this.items[i])
					}
				})
	
				}
			})
		}  else if(elm.nodeName === 'svg'){
			this.svg.forEach((el, i) => {
				if(el.dom === elm) {
					gsap.to(this.svg[i], {opacity: 0, duration: 0.5, onUpdate:() => {
						
					},
					onComplete: () => {
						this.remove(this.svg[i])
					}
				})
	
				}
			})
		} else {
			this.images.forEach((el, i) => {
				if(el.dom === elm) {
					gsap.to(this.images[i], {opacity: 0, duration: 0.5, onUpdate:() => {
						
					},
					onComplete: () => {
						this.remove(this.images[i])
					}
				})
	
				}
			})
		}
		
	}

	remove(item){
		if(item && item.dom){
			if(this.textOption.indexOf(item.dom.nodeName) > -1 ){
				this.items.forEach((el, i) => {
					if(el.dom === item.dom) {
						this.items.splice(i, 1)
					}
					
				})
			} else if(item.dom.nodeName === 'svg'){
				this.svg.forEach((el, i) => {
					if(el.dom === item.dom) this.svg.splice(i, 1)
					
				})
			} else {
				this.images.forEach((el, i) => {
					if(el.dom === item.dom) this.images.splice(i, 1)
					
				})
			}
		}

		if(item && !item.dom){
			if(this.textOption.indexOf(item.nodeName) > -1 ){
				this.items.forEach((el, i) => {
					if(el.dom === item) {
						this.items.splice(i, 1)
					}
					
				})
			} else if(item.nodeName === 'svg'){
				this.svg.forEach((el, i) => {
					if(el.dom === item) this.svg.splice(i, 1)
					
				})
			} else {
				this.images.forEach((el, i) => {
					if(el.dom === item) this.images.splice(i, 1)
					
				})
			}
		}

	}

	addEvents() {
		E.on('domCanvasAdd', (e) => {
			this.addEl(e)
		})
		E.on('domSvgUpdate', (e) => {
			this.updateSvg(e)
		})
		
		E.on('domCanvasRemove', (e) => {
			this.remove(e)
		})
		E.on('domCanvasOpacity', (e) => {
			this.opacityChange(e.el, e.value)
		})
		E.on('domCanvasHover', (e) => {
			this.hover(e)
		})
		E.on('domCanvasHoverLeave', (e) => {
			this.hoverLeave(e)
			// gsap.to(this.instance.material.uniforms.uHoverProgress, { value: 50,
			// 	onStart: () => { this.isAnimated = true},
			// 	onComplete: () => { this.isAnimated = false}})
		})
		E.on('domCanvasLeave', (e) => {
			this.itemLeave(e)
		})
		E.on('PageSwitch', () => {
			this.items = []
			this.images = []
			this.svg = []
		})
		
		store.Lenis.on('scroll', (e) => {
			// this.LenisScroll = e.scroll
			// this.LenisScroll = e.scroll
			if(store.isMobile) {
				this.LenisScroll = e.scroll
			} else {
				this.LenisScroll += e.velocity
			}
			
		})
		E.on(GlobalEvents.RESIZE, this.onResize)
	}
	setCanvas() {
		this.canvas = document.createElement("canvas");
		this.CanvasTexture = new Texture(this.canvas)
		this.instance.material.uniforms.uTexture.value = this.CanvasTexture

        this.context = this.canvas.getContext("2d");
		// document.documentElement.appendChild(this.canvas)
		this.canvas.classList.add('textCanvas')
		this.setCanvasSize()
	}

	setCanvasSize(){
		// this.pixelRatio = store.WebGL.renderer.getPixelRatio();
		this.pixelRatio = store.WebGL.renderer.getPixelRatio();
		this.canvas.width = store.window.w * this.pixelRatio ;
        this.canvas.height = store.window.h * this.pixelRatio ;

		this.context.scale(this.resolution * this.pixelRatio, this.resolution * this.pixelRatio);
	}

	setWords(el) {
		// this.dom.split.words.forEach(el => {
		el.position = el.dom.getBoundingClientRect()
		el.styleVal = window.getComputedStyle(el.dom, null);
		el.text = el.styleVal.textTransform === 'uppercase' ? el.dom.innerText.toUpperCase() : el.dom.innerText

		const lineHeight = parseFloat(el.styleVal.lineHeight)
		const fontSize = parseFloat(el.styleVal.fontSize)
		const lineHeightRatio = lineHeight / fontSize;
		el.offsetY = store.Lenis.scroll
		el.adjustTopPos = fontSize * this.adjustAscenderRatio + (lineHeightRatio - 1) * fontSize * 0.5;
		// });

	}

	setImage(el) {
		el.position = el.dom.getBoundingClientRect()
		el.offsetY = store.Lenis.scroll
	}

	setSvg(el){
		el.position = el.dom.getBoundingClientRect()
		this.svgToPng(el)
	}

	svgToPng(svg){
		// Data header for a svg image: 
		const dataHeader = 'data:image/svg+xml;charset=utf-8'
		// Serialize it as xml string:
		const serializeAsXML = $e => (new XMLSerializer()).serializeToString($e)
		// Encode URI data as UTF8 data:
		const encodeAsUTF8 = s => `${dataHeader},${encodeURIComponent(s)}`
		// Select the element:
		const $svg = svg.dom
		// Encode it as a data string:
		const svgData = encodeAsUTF8(serializeAsXML($svg))
		const img = new Image()
		img.src = svgData
		img.onload = () => {
			svg.image = img
			
			// return img;
		}
	}

	updateSvg(item){
		this.svg.forEach((el) => {
			if(el.dom === item) {
				this.svgToPng(el)
				// 
			}
		})
	}

	wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
		words = words.map((el, i) => (i !== words.length - 1) ? el + ' ' : el)
        var line = '';
		let lineNum = 1
		words.forEach(el => {
			const dashArray = el.split('-')
			if(dashArray.length > 1) {
				const newArray = dashArray.toSpliced(1, 0, '-')
				const index = words.indexOf(el)
				words.splice(index, 1)
				words.push(...newArray)
			}
		})
        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n];
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n];
            y += lineHeight;
			lineNum++
          }
          else {
            line = testLine;
			if(words[n + 1]){
				var breakLine = line + words[n + 1];
				var testMetrics = context.measureText(breakLine);
				var testWidthBreak = testMetrics.width;
				if (testWidthBreak > maxWidth && n+1 > 0) {

					if(words[n] !== '-' ){
						// line.substring(1, line.length - 1)
						const newLine = line.substring(0, line.length - 1)
						line = newLine
					}
				}
			}
          }
        }
        context.fillText(line, x, y);
		return { lineNumb: lineNum}
      }

	writeTexture = () => {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.globalCompositeOperation = "lighter"
		this.items.forEach((el) => {
			this.context.fillStyle = `rgba(0, 0, 255, ${el.opacity})`;
			this.context.font = el.styleVal.fontStyle + " " + el.styleVal.fontWeight + " " + parseFloat(el.styleVal.fontSize) * this.pixelRatio + "px " + el.styleVal.fontFamily;
			if(el.styleVal.textAlign === 'center') this.context.textAlign = 'center'
			
			const y = (el.position.top + parseInt(el.styleVal.marginBottom) +  parseFloat(el.styleVal.lineHeight) -  this.LenisScroll - el.adjustTopPos) * this.pixelRatio + el.y * this.pixelRatio
			
			el.textDrawn = this.wrapText(
				this.context,
				el.text,
				el.styleVal.textAlign === 'center' ? (this.canvas.width ) * 0.5  : el.position.left * this.pixelRatio + el.x * this.pixelRatio,
				y,
				el.position.width * this.pixelRatio,
				parseFloat(el.styleVal.lineHeight) * this.pixelRatio
			)
			// if(el.isHover){
				// el.hoverValue += (el.hoverValueTemp - el.hoverValue) * 0.01
				// const gradient = this.context.createLinearGradient((el.position.left + el.x) * this.pixelRatio + el.position.width * this.pixelRatio * el.hoverValue - 2000, 0, (el.position.left + el.x) * this.pixelRatio + el.position.width * this.pixelRatio * el.hoverValue, 0);
				const gradient = this.context.createLinearGradient((store.window.w + 1000) * this.pixelRatio * el.hoverValue - 1000, 0,(store.window.w + 1000) * this.pixelRatio * el.hoverValue, 0);
				gradient.addColorStop(0, "red");
				gradient.addColorStop(1, "black");
				const yHover = (el.position.top + parseInt(el.styleVal.marginBottom)-  this.LenisScroll ) * this.pixelRatio + el.y * this.pixelRatio
				this.context.save()
				this.context.globalAlpha = this.squareOpacity
				this.context.beginPath()
				this.context.rect(
					// el.position.left * this.pixelRatio + el.x * this.pixelRatio - 10,
					el.position.left * this.pixelRatio + el.x * this.pixelRatio - 10,
					yHover,
					// (el.position.width * this.pixelRatio) + 10,
					(store.window.w * this.pixelRatio) + 1000,
					(el.textDrawn.lineNumb * parseFloat(el.styleVal.lineHeight)) * 1.2 * this.pixelRatio
				)
				this.context.fillStyle = gradient;
				this.context.fill()
				this.context.closePath()
				this.context.restore()
			// }
		})

		// this.items.forEach((el) => {
		// 	if(el.isHover){
		// 		const y = (el.position.top + parseInt(el.styleVal.marginBottom) +  parseFloat(el.styleVal.lineHeight) -  this.LenisScroll - el.adjustTopPos) * this.pixelRatio + el.y * this.pixelRatio
		// 		this.material.uniforms.uHoverValY.value = y / (store.window.h *  this.pixelRatio)
		// 		this.material.uniforms.uHoverValH.value = parseFloat(el.styleVal.lineHeight) / (store.window.h)
		// 		console.log('COUCOU IN')
		// 	} else {
		// 		this.material.uniforms.uHoverValH.value = 0
		// 		console.log('COUCOU OUT')
		// 	}
		// })

		this.images.forEach(el => {
			this.context.save()
			this.context.globalAlpha = el.opacity
			this.context.drawImage(
				el.dom,
				el.position.left * this.pixelRatio + el.x * this.pixelRatio,
				(el.position.top - this.LenisScroll ) * this.pixelRatio + el.y * this.pixelRatio,
				el.position.width * this.pixelRatio,
				el.position.height * this.pixelRatio,
			)
			this.context.restore()
		})
		// this.svg.forEach(el => {
		// 	if(!el.image) return
		// 	this.context.save()
		// 	this.context.globalAlpha = el.opacity
		// 	this.context.drawImage(
		// 		el.image,
		// 		el.position.left * this.pixelRatio + el.x * this.pixelRatio,
		// 		(el.position.top - this.LenisScroll ) * this.pixelRatio + el.y * this.pixelRatio,
		// 		el.position.width * this.pixelRatio,
		// 		el.position.height * this.pixelRatio,
		// 	)
		// 	this.context.restore()
		// })
		this.CanvasTexture.needsUpdate = true
		this.instance.material.uniforms.uScroll.value = this.LenisScroll / store.window.h
		
		store.MainScene.activeCamera.layers.set(1)
		this.instance.visible = true
		this.renderPlane1.visible = false
		store.WebGL.renderer.setRenderTarget(this.target)
		store.WebGL.renderer.render(store.MainScene, store.MainScene.activeCamera)
		this.instance.visible = false
		this.renderPlane1.visible = true
		store.WebGL.renderer.setRenderTarget(null)
		store.MainScene.activeCamera.layers.set(0)

		this.renderPlane1.material.uniforms.uTexture.value = this.target.texture
		this.renderPlane.material.uniforms.uTexture.value = this.target.texture
	}

	load() {
		
	}

	onResize = () => {

		this.CanvasTexture = new Texture(this.canvas)
		// this.material.uniforms.uTexture.value = this.CanvasTexture
		this.instance.material.uniforms.uTexture.value = this.CanvasTexture
		this.setCanvasSize()
		this.items.forEach(el => {
			this.setWords(el)
		})
		this.images.forEach(el => {
			this.setImage(el)
		})
		this.svg.forEach(el => {
			this.setSvg(el)
		})

		if(!store.isMobile){
			this.LenisScroll = 0
		}

		this.setScale()
		
		// this.CanvasTexture.needsUpdate = true
		
		this.instance.material.uniforms.uResolution.value = new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
	}
}