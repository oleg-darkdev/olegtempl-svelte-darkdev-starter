const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  resolve: {
    extensions: ['.mjs', '.js', '.svelte']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js'
    //    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        //       exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  './theme',
                  './node_modules'
                ]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].[id].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      },
      canPrint: true
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      minify: prod
        ? {
          collapseWhitespace: true
        }
        : false
    }),
    new PreloadWebpackPlugin({
      rel: 'prefetch'
    })
  ],
  devtool: prod ? false : 'source-map'

}
