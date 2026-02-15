module.exports = {
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    hot: true,
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    target: 'electron-renderer',
    externals: {
      'electron': 'commonjs electron',
    },
    node: {
      __dirname: false,
      __filename: false,
    },
  },
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['__VUE_PROD_DEVTOOLS__'] = false;
      return args;
    });

    // Disable preload/prefetch for better Electron compatibility
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
  }
};
