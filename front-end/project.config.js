const NODE_ENV = process.env.NODE_ENV || 'development'
const DIST = process.env.DIST || 'localhost';
const os = require('os');
//获取本机IP
function getIp(){
  //return '10.3.208.241' //'localhost';


  return 'localhost';

  // return '10.3.208.241';
}
const port = 3000;
const ip = getIp();
const localPath = 'http://'+ip+':'+port  ;  //'http://localhost:3000';
var publicPath = '';

module.exports = {
  /** The environment to use when building the project */
  env: NODE_ENV,
  port: port,
  /** The full path to the project's root directory */
  basePath: __dirname,
  /** The name of the directory containing the application source code */
  srcDir: 'src',
  /** The file name of the application's entry point */
  main: 'main',
  /** The name of the directory in which to emit compiled assets */
  outDir: 'output',
  /** The base path for all projects assets (relative to the website root) */
  // publicPath: publicPath + '/crawl/',
  publicPath: publicPath + '/',
  /** Whether to generate sourcemaps */
  sourcemaps: false,
  staticPatch: publicPath,
  /** A hash map of keys that the compiler should treat as external to the project */
  externals: {},
  /** A hash map of variables and their values to expose globally */
  globals: {},
  /** Whether to enable verbose logging */
  verbose: false,
  /** The list of modules to bundle separately from the core application code */
  vendors: [
    'react',
    'react-dom',
    'redux',
    'react-redux',
    'react-router',
  ],
}
