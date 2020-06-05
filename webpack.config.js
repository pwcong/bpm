const path = require('path');
const webpack = require('webpack');
const prettier = require('prettier');
const klawSync = require('klaw-sync');
const fs = require('fs-extra');
const changeCase = require('change-case');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');

const pkg = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';
const isDocs = process.env.TARGET === 'docs';

const rootPath = __dirname;
const srcPath = path.resolve(rootPath, 'src');
const distPath = path.resolve(rootPath, 'dist');
const examplePath = path.resolve(rootPath, 'example');
const docsPath = path.resolve(rootPath, 'docs');

const commonCssLoaders = [
  isProd ? MiniCssExtractPlugin.loader : 'style-loader',
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      plugins: [require('postcss-preset-env')()],
    },
  },
];

const commonWebpackConfig = {
  mode: isProd ? 'production' : 'development',
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.scss$/,
        use: [...commonCssLoaders, 'sass-loader'],
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssLoaders,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#4285f4',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
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
      '@@': rootPath,
    },
    extensions: ['.js', '.ts', '.d.ts', '.tsx'],
  },
  devServer: {
    historyApiFallback: true,
    port: 1234,
    contentBase: [srcPath],
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
  ],
};

function getEntryCode(appPath, packages) {
  const code = `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { HashRouter as Router } from 'react-router-dom';
    
    import App from '${appPath}';
    const components = [
      ${packages
        .map(
          (pkg) => `{
            entry: React.lazy(() => import('${pkg.entry}')),
            name: '${pkg.name}'
          }`
        )
        .join(',')}
    ];
    
    ReactDOM.render(
      <Router>
        <App components={components}/>
      </Router>,
      document.getElementById('app')
    );
  `;

  return prettier.format(code, {
    parser: 'babel',
    semi: true,
    tabWidth: 2,
    singleQuote: true,
  });
}

function getPackages() {
  const packages = klawSync(path.join(srcPath, 'packages'), {
    depthLimit: 0,
    nofile: true,
  })
    .map((p) => ({
      entry: path.join(p.path, '__test__.tsx'),
      name: changeCase.pascalCase(path.basename(p.path)),
    }))
    .filter((p) => fs.pathExistsSync(p.entry));

  return packages;
}

if (isDocs) {
  const entryPath = path.join(examplePath, 'entry.tsx');

  module.exports = merge(commonWebpackConfig, {
    entry: entryPath,
    output: {
      path: path.join(rootPath, 'docs'),
      filename: 'index.min.js',
    },
    plugins: [
      new VirtualModulesPlugin({
        [entryPath]: getEntryCode(
          path.join(examplePath, 'docs.tsx'),
          getPackages()
        ),
      }),
      new HTMLWebpackPlugin({
        title: `Docs for ${pkg.name}`,
        template: path.join(examplePath, 'index.ejs'),
      }),
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
                to: path.join(docsPath, 'static'),
              },
            ]),
          ]
        : [
            new HTMLWebpackPlugin({
              title: `Test for ${pkg.name}`,
              template: path.join(examplePath, 'index.ejs'),
            }),
            new webpack.HotModuleReplacementPlugin(),
          ]
    ),
  });
} else {
  module.exports = merge(commonWebpackConfig, {
    entry: isProd
      ? path.join(srcPath, 'index.ts')
      : path.join(examplePath, 'index.tsx'),
    output: {
      path: distPath,
      filename: 'index.min.js',
      library: pkg.library,
      libraryTarget: 'umd',
    },
    plugins: isProd
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
            template: path.join(examplePath, 'index.ejs'),
          }),
          new webpack.HotModuleReplacementPlugin(),
        ],
  });
}
