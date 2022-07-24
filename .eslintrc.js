module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-empty-function': 'off',
  },
};
