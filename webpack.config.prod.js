const webpack = require('webpack')
const config = require('./webpack.config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = Object.assign(config, {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    }),
    new webpack.ProvidePlugin({
      THREE: 'three'
    })
  ]
})
