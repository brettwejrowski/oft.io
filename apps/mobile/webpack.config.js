const webpack = require('@nativescript/webpack');

module.exports = (env) => {
  webpack.init(env);
  webpack.useConfig('svelte');

  webpack.chainWebpack((config) => {
    config.resolve.alias.set(
      '@placewise/shared',
      require('path').resolve(__dirname, '../../packages/shared/src/index.ts')
    );
  });

  return webpack.resolveConfig();
};
