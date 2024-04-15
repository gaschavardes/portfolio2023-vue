<template class="lab_page">
	<div class="lab_page">
		<section class="lab_intro" id="thetop" ref="intro">

		</section>
		<section class="exp" >
			<div v-for="(item, key) in exps" :key="key" :class="item" ref="exps">

			</div>
		</section>
	</div>
</template>

<script>
  import './style.less'
  import gsap from 'gsap'
  import ScrollTrigger from 'gsap/ScrollTrigger'
  import store from '@/assets/js/store'
  import { E } from '@/assets/js/utils'

  gsap.registerPlugin(ScrollTrigger)
  export default {
	name: 'Lab-page',
	data() {
		return{
			publicPath: process.env.BASE_URL,
			projectProgress: 0,
			activeVideo: 'crosswire',
			activeDestination: 'the projects',
			animateTimeOut: null,
			exps: [
				"bubble"	
			]
		}
	},
	components: {
	},
	mounted() {
		setTimeout(() => {
			this.setScrollTrigger()
			ScrollTrigger.refresh()
		}, 1000)
	},
	beforeUnmount(){
		this.introScroll.kill()
		this.$refs.exps.forEach(el => {
			el.trigger.kill()
		})
	},
	methods: {
		appear() {
			// setTimeout(() => {
			// 	this.setScrollTrigger()
			// 	ScrollTrigger.refresh()
			// }, 1000)
		},
		initLab: () => {
			
		},
		setScrollTrigger(){
			this.introScroll =  ScrollTrigger.create({
				trigger: this.$refs.intro,
				start: 'top top',
				end: `+=${store.window.h}`,
				scrub: 1,
				onUpdate: function(self) {
					E.emit('introProgress', { value: self.progress})
				},
				onEnter:() => {
				},
				onEnterBack:() => {
				},
				onLeave:() => {
				}
			})
			this.$refs.exps.forEach(el => {
				el.trigger = ScrollTrigger.create({
					trigger: el,
					start: 'top top',
					end: `+=${store.window.h}`,
					scrub: 1,
					onUpdate: function() {
						E.emit('bubbleProgress', { value: self.progress})
					},
					onEnter:function(){
						E.emit('bubbleEnter', { value: 1})
					},
					onEnterBack:() => {
						E.emit('bubbleEnter', { value: -1})
					},
					onLeave:() => {
						E.emit('bubbleLeave', { value: -1})
					},
					onLeaveBack:() => {
						E.emit('bubbleLeave', { value: 1})
					}
				})
			})
		}
	}
  }
  </script>