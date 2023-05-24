<template>
	<section class="home">
		<section class="intro"></section>
		<section class="projects">
			<Counter/>
			<ProjectItem v-for="(el, id) in projects" :data='el' :key='id'/>
		</section>
	</section>
  </template>
  
  <script>
  import './style.less'
  import ProjectItem from '../../components/ProjectItem'
  import Counter from '../../components/Counter'
  export default {
	name: 'Home-page',
	data() {
		return{
			projects: [
				{
					name: 'crosswire',
					agency: 'Unseen Studio',
					link: 'https://crosswire.unseen.co/'
				},
				{
					name: 'crosswire',
					agency: 'Unseen Studio',
					link: 'https://visionaries.vc/'
				},
				{
					name: "Air Shifumi",
					// "type": "video",
					// "media": "airshifumi",
					agency: 'Hands Agency',
					"link": "https://airshifumi.hands.agency/"
				},
				{
					name: "Palais de tokyo",
					// "media": "palaisdetokyo",
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
					link: "https://jeudepaume.org/",
					"content": {

					}
				},
				{
					name: "Lab 1",
					// "image": "furidays.png",
					link: "https://reverent-neumann-6228ac.netlify.app/",
					"content": {

					}
				},
				{
					name: "Lab 2",
					// "image": "mobius.png",
					link: "https://mystifying-aryabhata-929c52.netlify.app/",
					"content": {

					}
				}
			]
		}
	},
	components: {
		ProjectItem,
		Counter
	},
	mounted() {
		this.setScrollTrigger()
	},
	methods: {
		setScrollTrigger() {

		}
	}
  }
  </script>
  