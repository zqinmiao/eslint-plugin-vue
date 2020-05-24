module.exports = (_config, _isServer) => {
  return {
    module: {
      rules: [
        {
          test: /\.txt$/i,
          use: 'raw-loader'
        }
      ]
    },

    resolve: {
      alias: {
        module: require.resolve('./shim/module')
      }
    }
  }
}
