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

permissions:
  contents: read

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
        cache: 'npm'  # Change to 'yarn' or 'pnpm' if using those package managers

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint --if-present

    - name: Run tests
      run: npm test

    - name: Generate coverage (if using Jest/Vitest)
      if: matrix.node-version == '20.x'
      run: npm test -- --coverage --coverageReporters=text --coverageReporters=lcov
      continue-on-error: true

    - name: Upload coverage to Codecov
      if: success() && matrix.node-version == '20.x' && hashFiles('coverage/lcov.info') != ''
      uses: codecov/codecov-action@v4
      with:
        files: ./coverage/lcov.info
        flags: node-\${{ matrix.node-version }}
        fail_ci_if_error: false
        # token: \${{ secrets.CODECOV_TOKEN }}  # Required for private repos

    - name: Build
      run: npm run build --if-present

    # Optional: Upload build artifacts for deployment or debugging
    # - name: Upload build artifacts
    #   if: matrix.node-version == '20.x'
    #   uses: actions/upload-artifact@v4
    #   with:
    #     name: build-output
    #     path: dist/  # Adjust to your build output directory
    #     retention-days: 7
`;
