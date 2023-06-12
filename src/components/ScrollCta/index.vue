<template>
		<button class="scroll-cta" @click="scrollTo">
			<div :class="{show : appear}" class="text-content">
				<span>scroll to <br>
				</span>
				<Transition name="slide" mode="out-in">
					<span :key="destination">{{ destination }}</span>
				</Transition>

			</div>
			
			<svg :class="{show : appear}" viewBox="0 0 100 100">
				<path d="M 60 30 L 40 50 L 60 70"/>
				<circle ref="circle" cx="50" cy="50" r="35"/>
			</svg>
		</button>
  </template>
  
  <script>
  import './style.less'
  import gsap from 'gsap'
  import store from '@/assets/js/store'
  import {E} from '@/assets/js/utils'
  export default {
	name: 'loader-component',
	props: {
		destination: String
	},
	data() {
		return{
			appear: false
		}
	},	
	components: {
	},
	mounted() {
		E.on('LoaderOut', () => {
			gsap.delayedCall(1, () => {
				this.appear = true
			})
		})
	},
	methods: {
		scrollTo(){
			store.Lenis.scrollTo(`#${this.destination.replace(/\s/g, '').replace(/[0-9]/g, '')}`, { offset: this.destination.replace(/\s/g, '') !== 'thetop' ? store.window.h * 0.5 : 0})
		}
	}
  }
  </script>
  