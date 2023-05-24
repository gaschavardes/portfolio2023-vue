<template>
		<div class="project__item">
			<div class="content">
				<h2 ref="title">{{ data.name }}</h2>
				<h4 ref="agency">{{ data.agency }}</h4>
			</div>
		</div>
  </template>
  
  <script>
  import './style.less'
  import SplitText from '../../assets/js/utils/gsap/SplitText'
  import gsap from 'gsap'
  export default {
	name: 'Project-item',
	props: {
		data: Object
	},
	data(){
		return{
			splits: []
		}
	},
	components: {
	},
	mounted() {
		this.split()
		
	},
	methods: {
		split() {
			this.$refs.title.split = new SplitText(this.$refs.title, {type:'chars', charsClass:'char'})
			this.$refs.agency.split = new SplitText(this.$refs.agency, {type:'chars', charsClass:'char'})
			this.splits = [this.$refs.title.split, this.$refs.agency.split ]

			this.tlIn = gsap.timeline({ paused: true})
			this.splits.forEach(el => {
				this.tlIn.to(el.chars, {opacity: 1, duration: 0.4, stagger: 0.02}, 0)
				.to(el.chars, {fontWeight: 900, duration: 0.4, stagger: 0.02}, 0.1)
				.to(el.chars, {fontWeight: 500, duration: 0.4, stagger: 0.02}, 0.2)
			})

			this.tlOut = gsap.timeline({ paused: true})
			this.splits.forEach(el => {
				this.tlOut.to(el.chars, {opacity: 0, fontWeight: 100, duration: 0.4, stagger: 0.02}, 0)
			})
		},
		enter() {
			this.tlIn.progress(0)
			this.tlIn.play()
		},
		leave() {
			this.tlOut.progress(0)
			this.tlOut.play()
		}
	}
  }
  </script>
  