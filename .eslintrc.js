module.exports = {
  'env': {
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 13,
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    '@typescript-eslint/no-explicit-any': 'off',
    'quotes': ['error', 'single'],
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'indent': ['error', 2],
    'max-len': ['warn', { code: 80, ignoreComments: true }],
    'semi': ['warn', 'always']
  }
};
