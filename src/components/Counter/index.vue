<template>
		<div class="counter hide">
			<div class="current" >
				<div class="current__item" v-for="n in number" :key="n" :ref="`item-${n}`" >{{ n }}</div>
			</div>
			<div>/</div>
			<div class="total">{{ number }}</div>
		</div>
  </template>
  
  <script>
  import './style.less'
  import gsap from 'gsap'
  export default {
	name: 'counter-',
	props: {
		number: Number,
		progress: Number
	},
	watch: {
		progress(val) {
			this.timeline.progress(val)
			if(val === 0) {
				this.$el.classList.add('hide')
			} else {
				this.$el.classList.remove('hide')
			}
		}
	},
	data() {
		return{
			positions: []
		}
	},	
	components: {
	},
	mounted() {
		this.getItem()
		this.setTimeline()
	},
	methods: {
		getItem() {
			// this.fullSize = 0
			// this.$refs.item.forEach((el) => {
			// 	el.size = el.getBoundingClientRect()
			// 	this.positions.push(this.fullSize + el.size.height * 0.5)
			// 	this.fullSize += el.size.height

			// })
		},
		setTimeline() {
			this.timeline = gsap.timeline({ paused: true })
			for (let index = 0; index < this.number; index++) {
				this.timeline.to(this.$refs[`item-${index + 1}`], { opacity: 1, y: 0, fontWeight: 800})
				this.timeline.to(this.$refs[`item-${index + 1}`], { opacity: 0, y: -100 + '%', fontWeight: 0}, '+=1')
			}
		}
	}
  }
  </script>
  