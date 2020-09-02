module.exports = {
  presets: [['@babel/preset-env', { modules: false }], '@babel/preset-react'],
  env: {
    test: {
      plugins: ['transform-es2015-modules-commonjs']
    }
  }
}
