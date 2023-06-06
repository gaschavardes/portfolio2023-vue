<template>
	<canvas id="gl"></canvas>
	<canvas id="texture"></canvas>
	<div ref="scrollContainer" class="scroll-container" >

		<Home ref="home"/>
  </div>
</template>

<script>
// import store from './assets/js/store'
// import '../src/assets/fonts/stylesheet.css'
import Home from './pages/home'
import Lenis from '@studio-freight/lenis'
import store from './assets/js/store'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import E from './assets/js/utils/E'
import GlobalEvents from './assets/js/utils/GlobalEvents'
export default {
  name: 'App',
  components: {
	Home
  },
  created() {

  },
  mounted() {
	const vh = store.window.h * 0.01
	document.documentElement.style.setProperty('--vh', `${vh}px`)
	
	store.Lenis = new Lenis({ wrapper: this.$refs.scrollContainer, content: this.$refs.home.$el })
	store.Lenis.start()
	store.Lenis.on('scroll', () => {
		ScrollTrigger.update()
	})

	ScrollTrigger.defaults({
		scroller: this.$refs.scrollContainer
	})
	// ScrollTrigger.scrollerProxy(this.$refs.scrollContainer)

	gsap.ticker.add((time)=>{
		store.Lenis.raf(time * 1000)
		ScrollTrigger.update()
	})

	store.isMobile = store.window.w < 500

	E.on(GlobalEvents.RESIZE, this.onResize)
  },
  methods: {
	raf() {
		// this.Lenis.raf(time)
		requestAnimationFrame(this.raf)
	},
	onResize() {
		const vh = store.window.h * 0.01
		document.documentElement.style.setProperty('--vh', `${vh}px`)
	}
  }
}
</script>

<style>

@font-face {
	font-family: "unbounded";
	src: url("~@/assets/fonts/Unbounded-VariableFont_wght.woff2") format("woff2 supports variations"),
		url("~@/assets/fonts/Unbounded-VariableFont_wght.woff2") format("woff2-variations");
	font-weight: 200 1000;

}
#gl, #texture{
	position: fixed;
	top: 0;
	left: 0;
	pointer-events: none;
	touch-action: none;
}
#texture{
	opacity: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  z-index: 100;
}
body{

    /* overscroll-behavior: none; */
    /* touch-action: none; */
    /* height: calc(var(--vh, 1vh) * 100); */
}
.scroll-container{
	scroll-behavior: none;
	height: 100vh;
	height: calc(var(--vh, 1vh) * 100) !important;
	overflow-y: hidden;
	overflow-x: hidden;
	position: relative;
	scrollbar-width: none;
	-ms-overflow-style: none;
	overscroll-behavior: none;
	overflow-y: auto;
	z-index: 10;
}
.canvas-container{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: -1;
    

    canvas{
        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
    }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }




/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
</style>
