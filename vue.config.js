const { defineConfig } = require('@vue/cli-service')
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
  }
})
