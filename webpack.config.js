const path = require('path')

module.exports = {
  entry: './example/example.js',
  output: {
    path: path.join(__dirname, '/example'),
    filename: 'dist.js'
  },
  module: {
    rules: [{
      test: /\.jsx?/i,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  devtool: 'eval-source-map'
}
