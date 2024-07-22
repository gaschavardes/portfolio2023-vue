

import { Texture, Mesh, PlaneGeometry, Vector2} from 'three'
import { E } from '../utils'
import GlobalEvents from '../utils/GlobalEvents'
import store from '../store'
import gsap from 'gsap'
import SplitText from '../utils/gsap/SplitText'
import { DomTextMaterial } from '../materials'
// import {TextTexture} from '../TextTexture'

gsap.registerPlugin(SplitText)
export default class DomText extends Mesh{
	constructor(){
		super()
		this.items = []
		this.images = []
		this.svg = []
		this.textOption = ['P', 'A', 'SPAN', 'DIV']
		this.load()
		this.geometry = new PlaneGeometry()
		this.material = new DomTextMaterial({
			uResolution: new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
		})
		this.scale.set(100, 100, 100)

		this.position.set(0, 0, -10)
		this.adjustAscenderRatio = 0.06
	}
	build() {
		this.setCanvas()
		// this.setWords()
		

		this.addEvents()
		store.RAFCollection.add(this.writeTexture, 0)
	}

	add(item){
		if(this.textOption.indexOf(item.el.nodeName) > -1 ){
			this.items.push({dom: item.el, opacity:item.opacity, x: item.x, y: item.y, id: item.id})
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
			this.add(e)
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
		this.material.uniforms.uTexture.value = this.CanvasTexture

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
      }

	writeTexture = () => {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.items.forEach((el) => {
			this.context.fillStyle = `rgba(255, 255, 255, ${el.opacity})`;
			this.context.font = el.styleVal.fontStyle + " " + el.styleVal.fontWeight + " " + parseFloat(el.styleVal.fontSize) * this.pixelRatio + "px " + el.styleVal.fontFamily;
			if(el.styleVal.textAlign === 'center') this.context.textAlign = 'center'
			this.wrapText(
				this.context,
				el.text,
				el.styleVal.textAlign === 'center' ? (this.canvas.width ) * 0.5  : el.position.left * this.pixelRatio + el.x * this.pixelRatio,
				(el.position.top + parseInt(el.styleVal.marginBottom) +  parseFloat(el.styleVal.lineHeight) -  this.LenisScroll - el.adjustTopPos) * this.pixelRatio + el.y * this.pixelRatio,
				Math.ceil((el.position.width + parseFloat(el.styleVal.fontSize) * 0.5)* this.pixelRatio),
				parseFloat(el.styleVal.lineHeight) * this.pixelRatio
			)
		})

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
		this.svg.forEach(el => {
			if(!el.image) return
			this.context.save()
			this.context.globalAlpha = el.opacity
			this.context.drawImage(
				el.image,
				el.position.left * this.pixelRatio + el.x * this.pixelRatio,
				(el.position.top - this.LenisScroll ) * this.pixelRatio + el.y * this.pixelRatio,
				el.position.width * this.pixelRatio,
				el.position.height * this.pixelRatio,
			)
			this.context.restore()
		})
		this.CanvasTexture.needsUpdate = true
	}

	load() {
		
	}

	onResize = () => {

		this.CanvasTexture = new Texture(this.canvas)
		this.material.uniforms.uTexture.value = this.CanvasTexture
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
		
		// this.CanvasTexture.needsUpdate = true
		
		this.material.uniforms.uResolution.value = new Vector2(store.window.w * store.WebGL.renderer.getPixelRatio(), store.window.h * store.WebGL.renderer.getPixelRatio())
	}
}