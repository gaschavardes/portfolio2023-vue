<template>
	<canvas id="gl"></canvas>
	<!-- <canvas id="texture"></canvas> -->
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
	
	store.Lenis = new Lenis({
		wrapper: this.$refs.scrollContainer,
		content: this.$refs.home.$el,
		gestureOrientation: 'vertical',
		syncTouch: true
	})
	store.Lenis.stop()
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

<style lang="less">

@font-face {
	font-family: "unbounded";
	src: url("~@/assets/fonts/Unbounded-VariableFont_wght.woff2") format("woff2 supports variations"),
		url("~@/assets/fonts/Unbounded-VariableFont_wght.woff2") format("woff2-variations");
	font-weight: 200 1000;
}

a:not(.button){
 

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
    height: calc(var(--vh, 1vh) * 100);
	overflow: hidden;
}
.scroll-container{
	scroll-behavior: auto !important;
	height: 100vh;
	height: calc(var(--vh, 1vh) * 100) !important;
	overflow: hidden;
	position: relative;
	scrollbar-width: none;
	-ms-overflow-style: none;
	overscroll-behavior: none;
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


@custom-ease: cubic-bezier(0.2, 0, 0.25, 1);
@ease-linear: cubic-bezier(0.25, 0.25, 0.75, 0.75);
@ease-InQuad: cubic-bezier(0.55, 0.085, 0.68, 0.53);
@ease-InCubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);
@ease-InQuart: cubic-bezier(0.895, 0.03, 0.685, 0.22);
@ease-InQuint: cubic-bezier(0.755, 0.05, 0.855, 0.06);
@ease-InSine: cubic-bezier(0.47, 0, 0.745, 0.715);
@ease-InExpo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
@ease-InCirc: cubic-bezier(0.6, 0.04, 0.98, 0.335);
@ease-InBack: cubic-bezier(0.6, 0, 0.735, 0.045);
@ease-OutQuad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
@ease-OutCubic: cubic-bezier(0.215, 0.61, 0.355, 1);
@ease-OutQuart: cubic-bezier(0.165, 0.84, 0.44, 1);
@ease-OutQuint: cubic-bezier(0.23, 1, 0.32, 1);
@ease-OutSine: cubic-bezier(0.39, 0.575, 0.565, 1);
@ease-OutExpo: cubic-bezier(0.19, 1, 0.22, 1);
@ease-OutCirc: cubic-bezier(0.075, 0.82, 0.165, 1);
@ease-OutBack: cubic-bezier(0.175, 0.885, 0.32, 1.275);
@ease-InOutQuad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
@ease-InOutCubic: cubic-bezier(0.645, 0.045, 0.355, 1);
@ease-InOutQuart: cubic-bezier(0.77, 0, 0.175, 1);
@ease-InOutQuint: cubic-bezier(0.86, 0, 0.07, 1);
@ease-InOutSine: cubic-bezier(0.445, 0.05, 0.55, 0.95);
@ease-InOutExpo: cubic-bezier(1, 0, 0, 1);
@ease-InOutCirc: cubic-bezier(0.785, 0.135, 0.15, 0.86);
@ease-InOutBack: cubic-bezier(0.68, 0, 0.265, 1);
@ease-special-1: cubic-bezier(0, 1, 0, 1);
@ease-special-2: cubic-bezier(0, 1, 1, 0);
@ease-expo: cubic-bezier(0, 0.82, 0, 0.985);
@ease-bounce: cubic-bezier(0.89, -0.01, 0, 1.37);
@ease-bounce-button: cubic-bezier(0.175, 0.885, 0.695, 1.135);
@ease-bounce-2: cubic-bezier(0.89, -0.005, 0, 2.65);
@ease-unbounce: cubic-bezier(0.83, -0.37, 0, 1.01);
@ease-bounce-in: cubic-bezier(0, 0, 0.2, 1.03);
@ease-bounce-out: cubic-bezier(0.045, 0.345, 0, 3.65);
@ease-custom-out: cubic-bezier(0, 1.16, 0, 0.99);

</style>
