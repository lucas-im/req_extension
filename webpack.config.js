const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader')
const _ = require('lodash')

module.exports = function (env, { mode = 'development' }) {
  const { production, development } = { [mode]: true }
  const base = opt => _.mergeWith({
    mode,
    watch: true,
    devtool: production ? false : 'inline-source-map',
    node: { fs: 'empty' },
    plugins: [new CleanWebpackPlugin()].filter(x => x),
    performance: { maxAssetSize: 1000 * 1024, maxEntrypointSize: 500 * 1024 },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'build')
    }
  }, opt, (o, n) => _.isArray(o) ? o.concat(n).filter(x => x) : n)
  return [
    base({
      entry: {
        background: './background.js',
        popup: './popup.js'
      },
      plugins: [
        development && new ChromeExtensionReloader(),
        new CopyWebpackPlugin({
          patterns: [
            { from: './manifest.json', to: 'manifest.json', toType: 'file' },
            { from: './popup.html', to: 'popup.html', toType: 'file' },
            { from: './res/', to: 'res', toType: 'dir' },
            { from: './lib/', to: 'lib', toType: 'dir' }
          ]
        })
      ]
    }),
  ]
}