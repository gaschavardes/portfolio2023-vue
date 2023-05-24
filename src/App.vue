<template>
  <canvas id="gl"></canvas>
	<Home/>
</template>

<script>
import store from './assets/js/store'
import Home from './pages/home'
export default {
  name: 'App',
  components: {
	Home
  },
  mounted() {
	console.log('COUCOU', store)
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
