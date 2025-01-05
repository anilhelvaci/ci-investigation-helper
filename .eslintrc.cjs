/* eslint-env node */

module.exports = {
    extends: ['@agoric', 'prettier'],
    plugins: ['prettier'],
    rules: { 'quotes': ['error', 'single'], },
    parserOptions: { 'ecmaVersion': 2020 },
};
