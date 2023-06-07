<template>
	<section class="home">
		<Loader/>
		<section class="intro" ref="intro">
			<div class="intro__text" ref="introContent">
				I'm Gaspard Chavardes,<br>
				a creative developper based in France<br>
				Former Hands Agency and Unseen,<br>
				I'm now available for some freelance jobs<br>
				Don't hesitate to ping me<br>
			</div>
		</section>
		<section class="projects" ref="projectContainer">
			<video id="videoContainer" :src="`./video/${activeVideo}.mp4`" muted playsinline loop ref="video"></video>
			<Counter :number="projects.length" :progress="this.projectProgress" />
			<ProjectItem v-for="(el, id) in projects" :data='el' :key='id' ref='projects'/>
		</section>
	</section>
  </template>
  
  <script>
  import './style.less'
  import ProjectItem from '../../components/ProjectItem'
  import Counter from '../../components/Counter'
  import Loader from '../../components/Loader'
  import gsap from 'gsap'
  import ScrollTrigger from 'gsap/ScrollTrigger'
  import store from '../../assets/js/store'
  import SplitText from '../../assets/js/utils/gsap/SplitText'




  gsap.registerPlugin(ScrollTrigger)
  export default {
	name: 'Home-page',
	data() {
		return{
			publicPath: process.env.BASE_URL,
			projectProgress: 0,
			activeVideo: 'crosswire',
			projects: [
				{
					name: 'Crosswire',
					agency: 'Unseen Studio',
					media: "crosswire",
					link: 'https://crosswire.unseen.co/'
				},
				{
					name: 'Visionnaries Club',
					agency: 'Unseen Studio',
					media: "visionaries",
					link: 'https://visionaries.vc/'
				},
				{
					name: "Air Shifumi",
					// "type": "video",
					media: "airshifumi",
					agency: 'Hands Agency',
					link: "https://airshifumi.hands.agency/"
				},
				{
					name: "Palais de tokyo",
					media: "palaisdetokyo",
					// "type": "video",
					agency: 'Hands Agency',
					link: "https://palaisdetokyo.com/",
					"content": {

					}
				},
				{
					name: "Bompard Shoppable Experience",
					"media": "bompard",
					"type": "video",
					agency: 'Hands Agency',
					link: "https://experience.eric-bompard.com/",
					"content": {

					}
				},
				{
					name: "27 lisboa",
					"media": "27lisboa",
					"type": "video",
					agency: 'Hands Agency',
					link: "https://27lisboa.com/",
					"content": {

					}
				},
				{
					name: "Jeu de paume",
					// "media": "jeudepaume",
					// "type": "video",
					agency: "Hands Agency",
					link: "https://jeudepaume.org/",
					"content": {

					}
				},
				{
					name: "Lab 1",
					// "image": "furidays.png",
					agency: "Lab",
					link: "https://reverent-neumann-6228ac.netlify.app/",
					"content": {

					}
				},
				{
					name: "Lab 2",
					// "image": "mobius.png",
					agency: 'Lab',
					link: "https://mystifying-aryabhata-929c52.netlify.app/",
					"content": {

					}
				}
			]
		}
	},
	components: {
		ProjectItem,
		Counter,
		Loader
	},
	mounted() {
		store.projects = this.projects
		gsap.delayedCall(1, this.setScrollTrigger)

		this.$refs.introContent.split = new SplitText(this.$refs.introContent, {type: 'lines'})
	},
	methods: {
		setScrollTrigger() {
			this.$refs.projects.forEach(el => {
				this.projectsTl = ScrollTrigger.create({
				trigger: el.$el,
				start: "top top", // when the top of the trigger hits the top of the viewport
				end: "bottom top", // end after scrolling 500px beyond the start
				scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
				onEnter: () => {
					el.enter()
					if(el.data.media) {
						this.activeVideo = el.data.media
						setTimeout(() => {
							this.$refs.video.play()
						}, 100)
					}
				},
				onLeave: () => {
					el.leave()
				},
				onEnterBack: () => {
					el.enter()
					if(el.data.media) {
						this.activeVideo = el.data.media
						setTimeout(() => {
							this.$refs.video.play()
						}, 100)
					}
				},
				onLeaveBack: () => {
					el.leave()
				}
			});
			})

			const that = this
			
			this.containerTl =  ScrollTrigger.create({
				trigger: this.$refs.projectContainer,
				start: "top top", // when the top of the trigger hits the top of the viewport
				end: "bottom top", // end after scrolling 500px beyond the start
				scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar,
				onUpdate: function(self) {
					that.projectProgress = self.progress
					if(store.MainScene) {
						store.MainScene.components.projects.progress = self.progress
					}
				}
			})

			console.log(this.$refs.intro, this.$refs.introContent.split)
			this.introTl = gsap.timeline({
				// yes, we can add it to an entire timeline!
				scrollTrigger: {
					trigger: this.$refs.projectContainer,
					start: "top bottom", // when the top of the trigger hits the top of the viewport
					end: "top top", // end after scrolling 500px beyond the start
					scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
				}
			});
			this.introTl.to(this.$refs.introContent.split.lines, {opacity: 0, stagger: -0.2})
			
		},
		play() {
			this.$refs.video.play()
		}
	}
  }
  </script>
  