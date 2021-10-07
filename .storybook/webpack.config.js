const modules = require('../config/modules');
const paths = require('../config/paths');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(scss|sass)$/,
    exclude: /\.module\.(scss|sass)$/,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader'
    ],
    sideEffects: true
  });
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.modules = ['node_modules', paths.appNodeModules].concat(
    modules.additionalModulePaths || []
  );
  return config;
};