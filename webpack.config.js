import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'index.js',
    clean: true,
  },
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
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    port: 8080,
    compress: true,
    hot: true,
    static: {
      directory: path.join(process.cwd(), 'dist'),
    },
  },
};

