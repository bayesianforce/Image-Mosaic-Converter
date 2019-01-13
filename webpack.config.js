'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    App: __dirname + '/js/client.js',
  },
  externals: [],
  output: {
    path: __dirname + '/dist/scripts',
    filename: 'PhotoMosaic.min.js',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  plugins: [
    /*    new BrowserSyncPlugin({
     host: 'localhost',
     port: 3000,
     server: { baseDir: [''] }
     }),*/
    new ExtractTextPlugin('App.css'),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      warnings: false,
      include: /\.min\.js$/,
      output: {
        comments: false,
      },
      sourceMap: true,
    }),
  ],
  watch: true,
};
