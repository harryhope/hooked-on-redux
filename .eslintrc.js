module.exports = {
  extends: [
    '@harryhope/eslint-config-hh',
    'eslint-config-standard-react'
  ],
  parser: 'babel-eslint',
  env: {
    node: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  plugins: [
    'react-hooks'
  ],
  rules: {
    'react/prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    react: { version: 'detect' }
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true
  }
}
