/* eslint-env node */

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const { env } = (typeof process !== 'undefined' ? process : { env: { NODE_ENV: 'development' } });

export default {
  mode: env.NODE_ENV || 'development',
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
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
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
      template: 'index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
  output: {
    filename: 'bundle.js',
    clean: true,
  },
  devServer: {
    hot: true,
    open: true,
    client: {
      overlay: false,
    },
  },
};