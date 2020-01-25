module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
      "no-unused-vars": 1,
      "comma-dangle": 0,
      "eol-last":0,
      "no-console":0,
      "linebreak-style": 0,
      "indent": [0, 2]

  },
};
