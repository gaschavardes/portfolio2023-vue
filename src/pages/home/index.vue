<template>
	<section class="home">
		<Loader/>
		<section class="intro" ref="intro">
			<div class="intro__text" ref="introContent">
				I'm Gaspard Chavardes,<br>
				A creative developper based in France<br>
				Former Hands Agency and Unseen,<br>
				I'm now available for some freelance jobs<br>
				Don't hesitate to <LinkComponent href="mailto:chavardes.gaspard@gmail.com" text="ping me" ref="pingTitle"/><br>
			</div>
		</section>
		<section class="projects" ref="projectContainer">
			<video id="videoContainer" :src="`./video/${activeVideo}.mp4`" muted playsinline loop ref="video"></video>
			<div class="video_preload">
				<video id="videoContainer" v-for="(el, id) in projects" :key='id' :src="`./video/${el.media}.mp4`" muted playsinline loop></video>
			</div>
			<Counter :number="projects.length" :progress="this.projectProgress" />
			<ProjectItem v-for="(el, id) in projects" :data='el' :key='id' ref='projects'/>
		</section>
		<section class="contact">
			<div class="contact__content" ref="contact">
				<h2 ref="contactTitle">Contact</h2>
				<hr>
				<ul class="contact__links">
					<li v-for="(link, i) in contactLinks" :key="i" :style="{ transitionDelay: Math.abs(i + 1 - Math.round(contactLinks.length * 0.5)) * 0.2 + 's'}">
						<LinkComponent :href="link.link" :text="link.name" ref="contactLink"/>
					</li>
				</ul>
			</div>
		</section>
	</section>
  </template>
  
  <script>
  import './style.less'
  import ProjectItem from '../../components/ProjectItem'
  import Counter from '../../components/Counter'
  import Loader from '../../components/Loader'
  import LinkComponent from '../../components/linkComponent'
  import gsap from 'gsap'
  import ScrollTrigger from 'gsap/ScrollTrigger'
  import store from '../../assets/js/store'
  import SplitText from '../../assets/js/utils/gsap/SplitText'
  import { E } from '../../assets/js/utils'

  gsap.registerPlugin(ScrollTrigger)
  export default {
	name: 'Home-page',
	data() {
		return{
			publicPath: process.env.BASE_URL,
			projectProgress: 0,
			activeVideo: 'crosswire',
			animateTimeOut: null,
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
					name: "Rémy Martin x Lee Broom",
					media: "leeBroom",
					// "type": "video",
					agency: 'Hands Agency',
					link: "https://www.remymartin.com/collection/xo-lee-broom/",
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
					name: "Jeu de paume",
					media: "jeudepaume",
					// "type": "video",
					agency: "Hands Agency",
					link: "https://jeudepaume.org/",
					"content": {

					}
				},
				{
					name: "27 lisboa",
					media: "27lisboa",
					"type": "video",
					agency: 'Hands Agency',
					link: "https://27lisboa.com/",
					"content": {

					}
				},
				// {
				// 	name: "Lab 1",
				// 	// "image": "furidays.png",
				// 	agency: "Lab",
				// 	link: "https://reverent-neumann-6228ac.netlify.app/",
				// 	"content": {

				// 	}
				// },
				// {
				// 	name: "Lab 2",
				// 	// "image": "mobius.png",
				// 	agency: 'Lab',
				// 	link: "https://mystifying-aryabhata-929c52.netlify.app/",
				// 	"content": {

				// 	}
				// }
			],
			contactLinks: [
				{
					link:'https://github.com/gaschavardes?tab=repositories',
					name: 'Github',
				},
				{
					link:'mailto:chavardes.gaspard@gmail.com',
					name: 'Mail',
				},
				{
					link:'https://www.linkedin.com/in/gaspardchavardes/',
					name: 'Linkedin',
				},
			]
		}
	},
	components: {
		ProjectItem,
		Counter,
		Loader,
		LinkComponent
	},
	mounted() {
		store.projects = this.projects
		gsap.delayedCall(1, this.setScrollTrigger)

		this.$refs.introContent.split = new SplitText(this.$refs.introContent, {type: 'lines, words', linesClass:"line", wordsClass: 'word'})
		console.log(this.$refs.introContent.split)
		this.$refs.introContent.split.lines.forEach((el, i) => {
			console.log(el)
			Array.from(el.children).forEach(word => {
				word.style.transitionDelay = `${i * 0.1}s`
			})
		})

		this.$refs.contactTitle.split = new SplitText(this.$refs.contactTitle, {type: 'chars', charsClass: 'chars'})
		const length = this.$refs.contactTitle.split.chars.length
		this.$refs.contactTitle.split.chars.forEach((el, i) => {
			el.style.transitionDelay = `${Math.abs(i + 1 - Math.round(length * 0.5)) * 0.05}s`
		})
		
		E.on('LoaderOut', () => {
			setTimeout(() => {
				this.$refs.introContent.classList.add('show')
				setTimeout(() => {
					this.$refs.pingTitle.appear()
				}, 2000)
			}, 700)
		})

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
				},
				onLeave: () => {
					this.$refs.contact.classList.add('show')
					clearTimeout(this.animateTimeOut)
					this.$refs.contact.classList.add('animateIn')
					setTimeout(() => {
						this.$refs.contactLink.forEach(el => {
							el.appear()
						})
					}, 500)

				},
				onEnterBack: () => {
					this.$refs.contact.classList.remove('show')
					this.animateTimeOut = setTimeout(() => {
						this.$refs.contact.classList.remove('animateIn')
						this.$refs.contactLink.forEach(el => {
							el.disappear()
						})
					}, 500)

				}
			})

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
  