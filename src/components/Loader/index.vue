<template>
		<div class="loader">
			
			<div class="loader__percent" :class="{ hide : isLoaded}">
				{{ percent }}<span>%</span>
			</div>
			<button class="loader__button" :class="{ hide : !isLoaded}" @click="close" ref="button">ENTER</button>
			<svg viewBox="0 0 100 100">
				<mask id="myMask">
					<rect x="0" y="0" width="100" height="100" fill="white" />
					<circle ref="mask" class="circle_inner" cx="50" cy="50" r="40" fill="black" />
				</mask>
				<circle ref="circle" cx="50" cy="50" r="40" mask="url(#myMask)"/>
			</svg>
		</div>
  </template>
  
  <script>
  import './style.less'
  import gsap from 'gsap'
//   import store from '@/assets/js/store'
  import {E} from '@/assets/js/utils'
  import GlobalEvents from '@/assets/js/utils/GlobalEvents'
  export default {
	name: 'loader-component',
	data() {
		return{
			percent: 0,
			svgPercent: 0,
			isLoaded: false
		}
	},	
	components: {
	},
	mounted() {
		E.on('AssetsProgress', (e) => {
			this.percent = e.percent

			if(e.percent === 100) {
				setTimeout(() => {
					E.off(GlobalEvents.RAF, this.animate)
				}, 1000)
				this.isLoaded = true
			}
		})
		E.on(GlobalEvents.RAF, this.animate)
	},
	methods: {
		animate() {
			this.$el.style.setProperty('--progress', this.percent * 0.01)
		},
		close(){
			const that = this
			this.$parent.play()
			this.$refs.circle.style.fill = '#FFF'
			gsap.to(this.$refs.mask, { r: 0, ease: 'power1.out'})
			gsap.to(this.$refs.circle, { 
				r: 0,
				ease: 'power1.in',
				onUpdate: function() {
					that.$refs.button.style.setProperty('--clipPath', 1 - this.progress())
				},
				onComplete:() => {
					gsap.to(this.$el, { autoAlpha: 0, duration: 0.2})
					E.emit('LoaderOut')
				}
			})
		}
	}
  }
  </script>
  