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
			this.$refs.title.split = new SplitText(this.$refs.title, {type:'chars, words, lines', charsClass:'char', linesClass:'line'})
			this.$refs.agency.split = new SplitText(this.$refs.agency, {type:'chars, words, lines', charsClass:'char', linesClass:'line'})
			this.splits = [this.$refs.title.split, this.$refs.agency.split ]

			this.tlOut = gsap.timeline({ paused: true})
			this.tlIn = gsap.timeline({ paused: true})
			this.splits.forEach(el => {
				gsap.delayedCall(2, () => {
					el.elements[0].style.width = el.elements[0].getBoundingClientRect().width + 'px'
					console.log(el.elements[0].getBoundingClientRect().width)

				})
				this.tlOut.fromTo(el.chars,  {fontWeight: 400, opacity: 1}, {opacity: 0, fontWeight: 100, duration: 0.4, stagger: 0.01}, 0)

				this.tlIn
				// .set(el.chars, {opacity: 0, fontWeight: 100})
				.fromTo(el.chars, {opacity: 0, fontWeight: 100}, {opacity: 1, duration: 0.6, stagger: 0.02}, 0)
				.to(el.chars, {fontWeight: 900, duration: 0.6, stagger: 0.01}, 0.1)
				.to(el.chars, {fontWeight: 400, duration: 0.6, stagger: 0.01}, 0.3)
			})

		},
		enter() {
			this.tlOut.pause()
			this.tlIn.progress(0)
			this.tlIn.play()
		},
		leave() {
			this.tlIn.pause()
			this.tlOut.progress(0)
			this.tlOut.play()
		}
	}
  }
  </script>
  