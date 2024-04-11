<template>
	<section class="lab" id="thetop">
		Coucou je suis le lab
	</section>
  </template>
  
  <script>
  import './style.less'
  import gsap from 'gsap'
  import ScrollTrigger from 'gsap/ScrollTrigger'
  import store from '@/assets/js/store'

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
			projects: [
				{
					name: 'Organimo',
					agency: 'Unseen Studio',
					media: "organimo",
					slug:'organimo',
					link: 'https://organimo.com/'
				},
				{
					name: 'Crosswire',
					agency: 'Unseen Studio',
					media: "crosswire",
					slug:'crosswire',
					link: 'https://crosswire.unseen.co/'
				},
				{
					name: 'Visionnaries Club',
					agency: 'Unseen Studio',
					media: "visionaries",
					slug:'visionnaries',
					link: 'https://visionaries.vc/'
				},
				{
					name: "Air Shifumi",
					// "type": "video",
					media: "airshifumi",
					slug:'airshifumi',
					agency: 'Hands Agency',
					link: "https://airshifumi.hands.agency/"
				},
				{
					name: "Palais de tokyo",
					media: "palaisdetokyo",
					// "type": "video",
					agency: 'Hands Agency',
					slug:'palais de tokyo',
					link: "https://palaisdetokyo.com/",
					"content": {

					}
				},
				{
					name: "Rémy Martin x Lee Broom",
					media: "leeBroom",
					// "type": "video",
					slug:'remy martin',
					agency: 'Hands Agency',
					link: "https://www.remymartin.com/collection/xo-lee-broom/",
					"content": {

					}
				},
				{
					name: "Bompard Shoppable Experience",
					media: "bompard",
					type: "video",
					slug:'bompard',
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
					slug:'jeu de paume',
					link: "https://jeudepaume.org/",
					"content": {

					}
				},
				{
					name: "27 lisboa",
					media: "27lisboa",
					"type": "video",
					agency: 'Hands Agency',
					slug:'27 lisboa',
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
	},
	mounted() {
	},
	methods: {
		appear() {
			store.Lenis.start()
		},
		initLab: () => {
			
		}
	}
  }
  </script>
  