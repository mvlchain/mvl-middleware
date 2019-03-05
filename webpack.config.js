const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const glob = require('glob');

const babelOptions = {
  babelrc: false,
  presets: [
    [
      'env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    'stage-2',
  ],
  plugins: ['transform-runtime'],
};

module.exports = {
  entry: {
    server: './server.ts',
  },
  target: 'node',
  node: {
    __dirname: true,
    __filename: true,
  },
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules|\.d\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
  externals: [
    nodeExternals({
      whitelist: [/util_lib/, /^models/, /models_lib/, /^app/, /^lib/],
    }),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.webpack.config.js', '.ts', '.tsx', '.js'],
    alias: {
      app: path.resolve('./app'),
      lib: path.resolve('./lib'),
      models: path.resolve('./models.js'),
      util: path.resolve('./util.ts'),
    },
  },
  optimization: {
    minimize: false
  }
};
