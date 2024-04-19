<template class="lab_page">
	<div class="lab_page">
		<ScrollCta :destination="activeDestination" :min="3" :max="3" ref="scrollCta"/>
		<section class="lab_intro" id="thetop" ref="intro">

		</section>
		<section class="exp" >
			<div v-for="(item, key) in exps" :key="key" :class="item" :id="item" ref="exps">

			</div>
		</section>
	</div>
</template>

<script>
  import './style.less'
  import gsap from 'gsap'
  import ScrollTrigger from 'gsap/ScrollTrigger'
  import { E } from '@/assets/js/utils'
  import ScrollCta from '../../components/ScrollCta'

  gsap.registerPlugin(ScrollTrigger)
  export default {
	name: 'Lab-page',
	data() {
		return{
			publicPath: process.env.BASE_URL,
			projectProgress: 0,
			activeVideo: 'crosswire',
			activeDestination: 'the drop',
			animateTimeOut: null,
			exps: [
				"thedrop"	
			]
		}
	},
	components: {
		ScrollCta
	},
	mounted() {
		setTimeout(() => {
			this.setScrollTrigger()
			ScrollTrigger.refresh()
		}, 2000)

		E.on('LoaderOut', () => {
			this.appear()
		})
	},

	beforeUnmount(){
		this.introScroll.kill()
		this.$refs.exps.forEach(el => {
			el.trigger.kill()
		})
	},
	methods: {
		appear(){
		gsap.delayedCall(2, () => {
			this.$refs.scrollCta.appear = true
		})

		},
		
		initLab: () => {
			
		},
		setScrollTrigger(){
			this.introScroll =  ScrollTrigger.create({
				trigger: this.$refs.intro,
				start: 'top top',
				end: `bottom top`,
				scrub: 1,
				onUpdate: function(self) {
					E.emit('introProgress', { value: self.progress})
				},
				onEnter:() => {
					// E.emit('introEnter')
					this.activeDestination = 'thedrop'
				},
				onEnterBack:() => {
					E.emit('introEnter')
					this.activeDestination = 'thedrop'
				},
				onLeave:() => {
					E.emit('introLeave')
				}
			})
			this.$refs.exps.forEach(el => {
				el.trigger = ScrollTrigger.create({
					trigger: el,
					start: 'top top',
					end: `bottom top`,
					scrub: 3,
					onUpdate: function() {
						E.emit('bubbleProgress', { value: self.progress})
					},
					onEnter:() => {
						this.activeDestination = 'thetop'
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