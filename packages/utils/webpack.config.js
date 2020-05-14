const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pkg = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';

const rootPath = __dirname;
const srcPath = path.resolve(rootPath, 'src');
const distPath = path.resolve(rootPath, 'dist');
const testPath = path.resolve(rootPath, '__test__');

const commonCssLoaders = [
  isProd ? MiniCssExtractPlugin.loader : 'style-loader',
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      plugins: [require('postcss-preset-env')()]
    }
  }
];
const config = (module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: isProd
    ? path.join(rootPath, 'index.ts')
    : path.join(testPath, 'index.tsx'),
  output: {
    path: distPath,
    ...(isProd
      ? {
          filename: 'index.min.js',
          library: pkg.library,
          libraryTarget: 'umd',
        }
      : {
          filename: 'index.js',
        }),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.scss$/,
        use: [...commonCssLoaders, 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: commonCssLoaders,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'imgs/[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': srcPath,
    },
    extensions: ['.js', '.ts', '.tsx'],
  },
  devServer: {
    historyApiFallback: true,
    port: 4000,
    contentBase: ['./'],
    inline: true,
    publicPath: '/',
    hot: true,
    quiet: true,
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackBar(),
    new FriendlyErrorsPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ].concat(
    isProd
      ? [
          new MiniCssExtractPlugin({
            filename: 'index.min.css',
            allChunks: true,
          }),
          new CopyWebpackPlugin([
            {
              from: path.join(rootPath, 'static'),
              to: path.join(distPath, 'static'),
            },
          ]),
        ]
      : [
          new HTMLWebpackPlugin({
            title: `Test for ${pkg.name}`,
            template: '__test__/index.ejs',
          }),
          new webpack.HotModuleReplacementPlugin(),
        ]
  ),
});
