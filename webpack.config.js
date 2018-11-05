const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/index.js',
  output: {
    filename: 'swagger2vuex.js',
    path: path.resolve(__dirname, 'bin')
  },
}
