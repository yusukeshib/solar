const webpack = require('webpack')

module.exports = {
  // devtool: 'source-map',
  entry: {
    index: './src/index.js',
    privacy: './src/privacy.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(jpg|png)/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader'
        }
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three'
    })
  ]
}
