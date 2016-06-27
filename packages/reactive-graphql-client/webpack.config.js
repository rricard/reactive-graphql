/* @flow */

const path = require("path")

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/dist/',
    filename: "bundle.js",
    libraryTarget: "var",
    library: "ReactiveGraphQLClient",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      },
    ],
  },
  devtool: 'source-map',
}
