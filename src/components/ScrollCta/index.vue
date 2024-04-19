<template>
		<button class="scroll-cta " :class="[{isContact : isContact}, {mobileHidden : mobileHidden}]" @click="scrollTo">
			<div :class="{show : appear}" class="text-content">
				<span>scroll to <br>
				</span>
				<Transition name="slide" mode="out-in">
					<span :key="destination">{{ destination }}</span>
				</Transition>

			</div>
			
			<svg :class="{show : appear, reverse: destination === 'thetop'}" viewBox="0 0 100 100">
				<path d="M 60 30 L 40 50 L 60 70"/>
				<circle ref="circle" cx="50" cy="50" r="35"/>
			</svg>
		</button>
  </template>
  
  <script>
  import './style.less'
//   import gsap from 'gsap'
  import store from '@/assets/js/store'
//   import {E} from '@/assets/js/utils'
  export default {
	name: 'loader-component',
	props: {
		destination: String,
		min: Number,
		max: Number
	},
	watch: {
		destination(val) {
			if(val === 'the top') {
				this.isContact = true
			} else {
				this.isContact = false
			}
		}
	},
	data() {
		return{
			appear: false,
			isContact: false,
			mobileHidden: true
		}
	},	
	components: {
	},
	mounted() {
		// E.on('LoaderOut', () => {
		// 	gsap.delayedCall(1, () => {
		// 		this.appear = true
		// 	})
		// })
	},
	methods: {
		scrollTo(){
			const destination = this.destination.replace(/\s/g, '').replace(/[0-9]/g, '')
			store.Lenis.scrollTo(`#${destination}`, { offset: destination !== 'thetop' ? store.window.h * 0.5 : 0, duration: destination !== 'thetop' ? this.$props.min : this.$props.max })
		}
	}
  }
  </script>
  