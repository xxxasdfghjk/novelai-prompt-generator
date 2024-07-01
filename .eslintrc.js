module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier'
  ],
  rules: {
    'no-console': 'error',
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: true
      }
    ]
  }
}
