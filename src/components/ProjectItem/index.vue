<template>
		<div class="project__item">
			<h2>{{ data.name }}</h2>
			<h4>{{ data.agency }}</h4>
		</div>
  </template>
  
  <script>
  import './style.less'
  export default {
	name: 'Project-item',
	props: {
		data: Object
	},
	components: {
	},
	mounted() {
	},
	methods: {
	}
  }
  </script>
  