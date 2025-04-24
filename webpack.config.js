/* eslint-env node */

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const PROJECT_ROOT = path.resolve(__dirname);
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: path.join(PROJECT_ROOT, 'src', 'index.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      { 
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: 'asset/inline',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PROJECT_ROOT, 'index.html'),
    }),
    new MiniCssExtractPlugin(),
  ],
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
    clean: true,
  },
  devServer: {
    hot: true,
    open: true,
    static: {
      directory: DIST_DIR,
    },
    client: {
      overlay: false,
    },
  },
};