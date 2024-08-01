<template>
		<div class="project__item">
			<div class="content">
				<a ref="link" :href="data.link" target="_blank" rel="nofollow">
					<div class="marquee-container container-1">
						<div class="marquee line-1" ref='lineCont1'>
							<span v-for="index in 20" :key="index" ref="line1">
								{{ data.line1 }}
							</span>
						</div>
					</div>
					
					<h2 ref="title" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">{{ data.name }}</h2>
					<div class="marquee-container container-2">
						<div class="marquee line-2" ref='lineCont2'>
							<span v-for="index in 20" :key="index" ref="line2">
								{{ data.line2 }}
							</span>
						</div>
					</div>
					
					<!-- <h4 ref="agency">{{ data.agency }}</h4>
					<Button icon="visit" text="Visit site" :link="data.link" ref="button" /> -->
				</a>
				<video class="video" ref="video" :src="`./video/${data.media}.mp4`" muted playsinline loop></video>
			</div>
		</div>
  </template>
  
  <script>
  import './style.less'
  import SplitText from '../../assets/js/utils/gsap/SplitText'
  import gsap from 'gsap'
  import store from '@/assets/js/store'
//   import Button from '../Button'
  import E from '@/assets/js/utils/E'
  export default {
	name: 'Project-item',
	props: {
		data: Object
	},
	data(){
		return{
			splits: [],
			beforeVar: 0,
			hoverVal: 0,
			hoverValTemp: 0,
			marqueeSpeed: 1
		}
	},
	components: {
	},
	mounted() {
		this.split()
		this.outDelay 
		setTimeout(() => {
			E.emit('domCanvasAdd', { el: this.$refs.title, opacity: 0, y: 100, x: 0})
		}, 1000)
		this.$refs.link.style.setProperty('--beforeScale', 0);
		store.RAFCollection.add(this.animate, 0)

		setTimeout(() => {
			
			const line1Size = this.$refs.line1[0].getBoundingClientRect()
			this.line1Total = 0
			this.$refs.line1.forEach((el, i) => {
				if(i === 0) {
					el.transformValue = this.line1Total

				} else {
					el.transformValue = this.line1Total - line1Size.width

				}
				el.style.transform = `translateX(${el.transformValue}px)`
				this.line1Total += line1Size.width 
			})

			const line2Size = this.$refs.line2[0].getBoundingClientRect()
			this.line2Total = 0
			this.$refs.line2.forEach((el, i) => {
				if(i === 0) {
					el.transformValue = store.window.w + line2Size.width

				} else {
					el.transformValue = store.window.w - this.line2Total
				}
			
				el.style.transform = `translateX(${el.transformValue}px)`
				this.line2Total += line2Size.width 
			})
			// gsap.set(this.$refs.lineCont1, {x:-100 + 'vw'})
			// gsap.set(this.$refs.lineCont2, {x:100 + 'vw'})
		}, 500)

		
		
	},
	// onBeforeUnmount() {
		
	// },
	methods: {
		split() {
			
			this.$refs.title.split = new SplitText(this.$refs.title, {type:'chars, words, lines', charsClass:'char', linesClass:'line', wordsClass:'word'})
			
			// this.$refs.agency.split = new SplitText(this.$refs.agency, {type:'chars, words, lines', charsClass:'char', linesClass:'line'})
			this.splits = [this.$refs.title.split]

			this.tlOut = gsap.timeline({ paused: true})
			this.tlHover = gsap.timeline({ paused: true})

			this.tlHover = gsap.timeline({ paused: true})
			this.tlHover.to(this, { beforeVar: 1,  duration: 3, onUpdate: () => {
				// this.$refs.link.style.setProperty('--beforeScale', this.beforeVar);
				E.emit('domCanvasHover', { el: this.$refs.title, val: this.beforeVar })
			}})
			// .to(this.$refs.title.split.chars, { y: 0, stagger: 0.05, duration: 0.1}, '-=0.25')



			// this.splits.forEach(el => {
			// 	gsap.delayedCall(2, () => {
			// 		el.elements[0].style.width = el.elements[0].getBoundingClientRect().width + 'px'

			// 	})
			// 	this.tlOut.fromTo(el.chars,  { '--wght': 400, opacity: 1}, {opacity: 0,  '--wght': 200, duration: 0.4, stagger: 0.01}, 0)

			// 	this.tlIn
			// 	// .set(el.chars, {opacity: 0,  '--wght': 100})
			// 	.fromTo(el.chars, {opacity: 0,  '--wght': 200}, {opacity: 1, duration: 0.6, stagger: 0.02}, 0)
			// 	.to(el.chars, { '--wght': 900, duration: 0.6, stagger: 0.01}, 0.1)
			// 	.to(el.chars, { '--wght': 400, duration: 0.6, stagger: 0.01}, 0.3)
			// })

		},

		animate(){
			if(this.isHover){
				this.$refs.line1.forEach((el) => {
					el.transformValue += this.marqueeSpeed
					el.style.transform = `translateX(${el.transformValue % this.line1Total - this.line1Total * 0.2}px)`
				})
				this.$refs.line2.forEach((el) => {
					el.transformValue -= this.marqueeSpeed
					el.style.transform = `translateX(${el.transformValue % this.line2Total + store.window.w }px)`
				})
			}
			
			// this.hoverVal += (this.hoverValTemp - this.hoverVal) * 0.12
			// this.tlHover.progress(this.hoverVal / 1.2)
		
		},

		enter() {
			// this.$el.style.pointerEvents = 'all'
			// this.$refs.button.appear()
			// this.tlOut.pause()
			// this.tlIn.progress(0)
			// this.tlIn.play()
		},
		leave() {
			// this.$el.style.pointerEvents = 'none'
			// this.$refs.button.disappear()
			// this.tlIn.pause()
			// this.tlOut.progress(0)
			// this.tlOut.play()
		},
		onMouseEnter(){
			this.tlHover.play()
			this.isHover = true
			// console.log(this.data.media)
			this.$refs.video.play()

			E.emit('videoTextureUpdate', { src: this.$refs.video, way: 'in'})
			
		},
		onMouseLeave(){
			if(this.beforeVar < 0.5){
				this.tlHover.reverse()
			} else {
				E.emit('domCanvasHover', { el: this.$refs.title, val: 0 })
				gsap.delayedCall(0.2, () => {
					this.tlHover.pause()
					this.tlHover.seek(0)
				})
			}
		}
	}
  }
  </script>
  