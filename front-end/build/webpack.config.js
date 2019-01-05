const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const project = require('../project.config')

const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const theme = require('../theme')

const postcssOpts = {
  ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
  plugins: () => [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
    }),
    // pxtorem({rootValue: 75, propWhiteList: []})
  ],
  sourceMap: project.sourcemaps,
  minimize: {
    discardComments: {
      removeAll: true,
    },
    discardUnused: false,
    mergeIdents: false,
    reduceIdents: false,
    safe: true,
    sourcemap: project.sourcemaps,
  },
}

const inProject = path.resolve.bind(path, project.basePath)
const inProjectSrc = (file) => inProject(project.srcDir, file)

const __DEV__ = project.env === 'development'
const __TEST__ = project.env === 'release'
const __PROD__ = project.env === 'production'

const config = {
  entry: {
    normalize: [
      inProjectSrc('normalize'),
    ],
    main: [
      inProjectSrc(project.main),
    ],
  },
  devtool: project.sourcemaps ? 'source-map' : false,
  output: {
    path: inProject(project.outDir),
    filename: __DEV__ ? 'statics/js/[name].js' : 'statics/js/[name].[chunkhash].js',
    publicPath: project.publicPath,
  },
  resolve: {
    modules: [
      inProject(project.srcDir),
      'node_modules',
    ],
    extensions: ['*', '.web.js', '.js', '.jsx', '.json'],
  },
  externals: project.externals,
  module: {
    rules: [],
  },

  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.env': {NODE_ENV: JSON.stringify(project.env)},
      __DEV__,
      __TEST__,
      __PROD__,
     '__ROOT__': __DEV__ ? JSON.stringify('http://localhost:3001') : JSON.stringify(''),
     //'__ROOT__': __DEV__ ? JSON.stringify('http://10.3.208.218:8080') : JSON.stringify(''),
    }, project.globals)),
  ]
}

// JavaScript
// ------------------------------------

config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
      plugins: [
        'babel-plugin-transform-class-properties',
        'babel-plugin-syntax-dynamic-import',
        [
          'babel-plugin-transform-runtime',
          {
            helpers: true,
            polyfill: false, // we polyfill needed features in src/normalize.js
            regenerator: true,
          },
        ],
        [
          'babel-plugin-transform-object-rest-spread',
          {
            useBuiltIns: true // we polyfill Object.assign in src/normalize.js
          },
        ],
        //['import', {'style': 'css', 'libraryName': 'antd-mobile'}],
        ['import', {'style': true, 'libraryName': 'antd'}],
      ],
      presets: [
        'babel-preset-react',
        ['babel-preset-env', {
          modules: false,
          targets: {
            ie9: true,
          },
          uglify: true,
        }],
      ]
    },
  }],
})

// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
  filename: 'statics/css/styles/[name].[contenthash].css',
  allChunks: true,
  disable: true   //__DEV__,
})

config.module.rules.push({
  test: /\.(css)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: project.sourcemaps,
          minimize: {
            discardComments: {
              removeAll: true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: project.sourcemaps,
          },
        },
      },
      {
        loader: 'postcss-loader',
        options: postcssOpts,
      }
    ],
  })
})

config.module.rules.push({
  test: /\.(less)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: project.sourcemaps,
          minimize: {
            discardComments: {
              removeAll: true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: project.sourcemaps,
          },
        },
      },
      {
        loader: 'postcss-loader',
        options: postcssOpts,
      },
      {
        loader: 'less-loader',
        options: {
          sourceMap: project.sourcemaps,
          includePaths: [
            inProjectSrc('src'),
          ],
          modifyVars: theme()
        },
      }
    ],
  })
})

config.plugins.push(extractStyles)

//svg
config.module.rules.push({
  test: /\.(svg)$/i,
  loader: 'svg-sprite-loader',
  include: [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // antd-mobile使用的svg目录
    path.resolve(__dirname, '../src/'),  // 个人的svg文件目录，如果自己有svg需要在这里配置
  ]
})

// Images
// ------------------------------------
config.module.rules.push({
  test: /\.(png|jpg|gif|jpeg)$/,
  loader: 'url-loader',
  options: {
    limit: 8192,
    name: 'statics/images/[hash:8].[name].[ext]'
  },
})

// Fonts
// ------------------------------------
;[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  // ['svg', 'image/svg+xml'],
].forEach((font) => {
  const extension = font[0]
  const mimetype = font[1]

  config.module.rules.push({
    test: new RegExp(`\\.${extension}$`),
    loader: 'url-loader',
    options: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype,
    },
  })
})

// HTML Template
// ------------------------------------
config.plugins.push(new HtmlWebpackPlugin({
  template: inProjectSrc('index.html'),
  inject: true,
  minify: {
    removeComments: true, //移除HTML中的注释
    collapseWhitespace: true,
  },
  projectPath: process.env.DIST ==='www' || process.env.DIST ==='uat' ? "" : ""     //project.staticPatch     //静态资源域名
}))


// Development Tools
// ------------------------------------
if (__DEV__) {
  // `webpack-hot-middleware/client.js?path=${config.output.publicPath}__webpack_hmr`
  config.entry.main.push(
    `webpack-hot-middleware/client.js?path=/__webpack_hmr`
  )
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

// Bundle Splitting
// ------------------------------------
if (!__TEST__) {
  const bundles = ['normalize', 'manifest']

  if (project.vendors && project.vendors.length) {
    bundles.unshift('vendor')
    config.entry.vendor = project.vendors
  }
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({names: bundles}))
}

// Production Optimizations
// ------------------------------------
if (__PROD__ || __TEST__) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!config.devtool,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
    })
  )
}

module.exports = config
