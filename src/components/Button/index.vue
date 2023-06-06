<template>
		<div class="button">
			<img :src="linkIcon" alt="" class="link-logo">
			{{ text }}
		</div>
  </template>
  
  <script>
  import './style.less'
  import linkIcon from '@/assets/images/icons/link.svg'
//   import gsap from 'gsap'
  export default {
	name: 'link-button',
	props: {
		text: String,
		icon: String
	},
	watch: {
	},
	setup() {
      return {
        linkIcon
      };
    },
	data() {
		return{
			positions: []
		}
	},	
	components: {
	},
	mounted() {
		console.log(linkIcon)
	},
	methods: {
	
	}
  }
  </script>
  