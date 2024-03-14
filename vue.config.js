const { defineConfig } = require('@vue/cli-service')
const SitemapPlugin = require('sitemap-webpack-plugin').default

const paths = [
	{
		path: '/',
		lastmod: '2024-03-14T11:30:45+00:00',
		priority: 1.0,
		changefreq: 'yearly'
	}]
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
	.rule('glslify')
	.test(/\.(glsl|vs|fs|vert|frag)$/)
	.use('raw-loader')
	.loader('raw-loader')
	.end()
	.use('glslify-loader')
	.loader('glslify-loader')
	.end()
  },
  configureWebpack: {
	plugins: [
		new SitemapPlugin({ base: 'https://gaspardchavardes.fr/', paths })
	]
},
})
