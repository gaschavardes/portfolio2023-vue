<template>
		<a class="link" :data-text="text" :href="link" target="_blank" rel="nofollow" @mouseenter="mouseEnter" @mouseleave="mouseLeave" ref="button">
			<span ref="text">{{ text }}</span>
		</a>
  </template>
  
  <script>
  import './style.less'
  import linkIcon from '@/assets/images/icons/link.svg'
  import SplitText from '../../assets/js/utils/gsap/SplitText'
  export default {
	name: 'link-component',
	props: {
		text: String,
		link: String
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
		this.$refs.text.split = new SplitText(this.$refs.text, { type:'chars', charsClass:'char' })
		this.$refs.text.split.chars.forEach((el, i) => {
			el.style.transitionDelay = `${i * 0.05}s`
		})
	},
	methods: {
		appear() {
			this.$el.classList.add('show')
		}
	}
  }
  </script>
  