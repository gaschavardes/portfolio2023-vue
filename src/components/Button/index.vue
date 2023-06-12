<template>
		<a class="button" :href="link" target="_blank" rel="nofollow" @mouseenter="mouseEnter" @mouseleave="mouseLeave" ref="button">
			<div class="button-border" ref="border">
					<div class="button-border-left"></div>
					<div class="button-border-center"></div>
					<div class="button-border-right"></div>
				</div>
			<div class="button-container" ref="content">
				<div class="link-logo">
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;" viewBox="0 0 79.935 79.935" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd"><defs>
					</defs><g><path class="fil0" d="M54.073 9.405c-2.597,0 -4.703,-2.106 -4.703,-4.703 0,-2.596 2.106,-4.702 4.703,-4.702l21.16 0c2.595,0 4.702,2.108 4.702,4.702l0 21.161c0,2.596 -2.106,4.702 -4.702,4.702 -2.596,0 -4.702,-2.106 -4.702,-4.702l0 -9.81 -27.239 27.239c-1.836,1.835 -4.813,1.835 -6.649,0 -1.835,-1.836 -1.835,-4.813 0,-6.649l27.239 -27.238 -9.809 0zm16.458 35.265c0,-2.597 2.106,-4.702 4.702,-4.702 2.596,0 4.702,2.105 4.702,4.702l0 30.563c0,2.596 -2.106,4.702 -4.702,4.702l-70.531 0c-2.596,0 -4.702,-2.106 -4.702,-4.702l0 -70.531c0,-2.596 2.106,-4.702 4.702,-4.702l30.563 0c2.597,0 4.703,2.106 4.703,4.702 0,2.597 -2.106,4.703 -4.703,4.703l-25.86 0 0 61.126 61.126 0 0 -25.861z"/></g>
				</svg>
			</div>
			<span ref="text">Visit COUCOU</span>
			</div>
		</a>
  </template>
  
  <script>
  import './style.less'
  import linkIcon from '@/assets/images/icons/link.svg'
  import gsap from 'gsap'
  import SplitText from '../../assets/js/utils/gsap/SplitText'
  export default {
	name: 'link-button',
	props: {
		text: String,
		icon: String,
		link: String
	},
	setup() {
      return {
        linkIcon
      };
    },
	data() {
		return{
			positions: []
		}
	},	
	components: {
	},
	mounted() {
		this.size = this.$refs.button.getBoundingClientRect()
		this.scaleVal = 25

		this.$refs.text.split = new SplitText(this.$refs.text, {type:'chars, words, lines', charsClass:'char', linesClass:'line'})
		this.$refs.text.split.chars.forEach(el => {
			el.style.opacity = 0
		})

		this.enterTl = gsap.timeline({paused: true})
			this.enterTl.to(this, {
				scaleVal: this.size.width, 
				onUpdate: () => {
					this.$el.style.setProperty('--contentWidth', this.scaleVal)
				}
			})
			.to(this.$refs.text.split.chars, { opacity: 1, stagger: 0.02, duration: 0.2}, 0)

		this.leaveTl = gsap.timeline({paused: true})
		this.leaveTl.to(this.$refs.text.split.chars, { opacity: 0, duration: 0.2}, 0)
		.to(this, {
				scaleVal: 25, 
				onUpdate: () => {
					this.$el.style.setProperty('--contentWidth', this.scaleVal)
				}
			}, 0.2)
		

	},
	methods: {
		mouseEnter() {
			this.leaveTl.pause()
			this.enterTl.progress(0)
			this.enterTl.play()
		},
		mouseLeave() {
			this.enterTl.pause()
			this.leaveTl.progress(0)
			this.leaveTl.play()
		},
		appear() {
			gsap.to(this.$refs.border, {scale: 1})
			gsap.to(this.$refs.content, {opacity: 1})
		},
		disappear() {
			gsap.to(this.$refs.border, {scale: 0})
			gsap.to(this.$refs.content, {opacity: 0})
		}
	}
  }
  </script>
  