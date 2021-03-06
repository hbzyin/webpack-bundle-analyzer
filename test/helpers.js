const chai = require('chai');
const webpack = require('webpack');

chai.use(require('chai-subset'));

global.expect = chai.expect;
global.sinon = require('sinon');
global.webpackCompile = webpackCompile;
global.makeWebpackConfig = makeWebpackConfig;

const BundleAnalyzerPlugin = require('../lib/BundleAnalyzerPlugin');

function webpackCompile(config) {
  return new Promise((resolve, reject) => {
    webpack(config, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function makeWebpackConfig(opts) {
  opts = {
    analyzerOpts: {
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'error'
    },
    minify: false,
    multipleChunks: false,
    ...opts
  };

  return {
    context: __dirname,
    entry: {
      bundle: './src'
    },
    output: {
      path: `${__dirname}/output`,
      filename: '[name].js'
    },
    plugins: (plugins => {
      plugins.push(
        new BundleAnalyzerPlugin(opts.analyzerOpts)
      );

      if (opts.multipleChunks) {
        plugins.push(
          new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
          })
        );
      }

      if (opts.minify) {
        plugins.push(
          new webpack.optimize.UglifyJsPlugin({
            comments: false,
            mangle: true,
            compress: {
              warnings: false,
              negate_iife: false
            }
          })
        );
      }

      return plugins;
    })([])
  };
}
