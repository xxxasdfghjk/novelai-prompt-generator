module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier'
  ],
  rules: {
    'no-console': ['error', { allow: ['error'] }],
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: true
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_'
      }
    ]
  }
}
