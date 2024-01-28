const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'scanner.html',
      template: './src/scanner.html',
      excludeChunks: ['index']
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    open: true
  },
  // Ajoutez les chargeurs et autres configurations au besoin
};
