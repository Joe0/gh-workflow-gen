export const lint = `name: Lint

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run ESLint
      if: hashFiles('.eslintrc*', 'eslint.config.*') != ''
      run: npm run lint
      continue-on-error: false

    - name: Run Prettier check
      if: hashFiles('.prettierrc*', 'prettier.config.*') != '' || hashFiles('package.json') != ''
      run: npx prettier --check "**/*.{js,jsx,ts,tsx,json,md,yml,yaml}"
`;
