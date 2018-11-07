const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/index.js',
  output: {
    filename: 'swagger2vuex.sh',
    path: path.resolve(__dirname, 'bin')
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
  ],
}
