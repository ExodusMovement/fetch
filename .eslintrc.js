module.exports = {
  extends: ['@exodus/eslint-config/typescript'],
  globals: {
    WebSocket: 'readonly',
  },
  rules: {
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
}
