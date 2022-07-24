const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const webpackPlugins = require('./webpack.plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  publicPath: '/stories/',
  chainWebpack: config => {
    config.output.chunkFilename(`[id].[chunkhash:8].js`);
    config.plugins.delete('prefetch');
    config.resolve.alias.set('@', path.resolve(__dirname, 'src/'));
    config.module.rule('images').set('parser', {
      dataUrlCondition: {
        maxSize: 4 * 1024,
      },
    });
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(...webpackPlugins);
    }
  },
});
