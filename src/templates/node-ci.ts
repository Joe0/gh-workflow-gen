export const nodeCi = `name: Node.js CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

# Cancel in-progress runs on new push to same PR/branch
concurrency:
  group: \${{ github.workflow }}-\${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        node-version: [18.x, 20.x, 22.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint --if-present

    - name: Run tests with coverage
      run: npm test -- --coverage --coverageReporters=text --coverageReporters=lcov

    - name: Upload coverage to Codecov
      if: matrix.node-version == '20.x'
      uses: codecov/codecov-action@v4
      with:
        files: ./coverage/lcov.info
        flags: node-\${{ matrix.node-version }}
        fail_ci_if_error: false

    - name: Build
      run: npm run build --if-present
`;
