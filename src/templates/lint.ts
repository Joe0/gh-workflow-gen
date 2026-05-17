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

    # Node.js linting
    - name: Use Node.js
      if: hashFiles('package.json') != ''
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install Node dependencies
      if: hashFiles('package.json') != ''
      run: npm ci

    - name: Run ESLint
      if: hashFiles('.eslintrc*', 'eslint.config.*', '.eslintrc.json') != ''
      run: npm run lint
      continue-on-error: false

    - name: Run Prettier check
      if: hashFiles('.prettierrc*', 'prettier.config.*') != '' || hashFiles('package.json') != ''
      run: npx prettier --check . --ignore-unknown

    # Python linting
    - name: Set up Python
      if: hashFiles('**/*.py', 'requirements*.txt', 'pyproject.toml', 'setup.py') != ''
      uses: actions/setup-python@v5
      with:
        python-version: '3.x'
        cache: 'pip'

    - name: Install flake8
      if: hashFiles('**/*.py') != '' && hashFiles('.flake8', 'setup.cfg', 'tox.ini') != ''
      run: pip install flake8

    - name: Install black
      if: hashFiles('**/*.py') != '' && hashFiles('pyproject.toml', '.black') != ''
      run: pip install black

    - name: Install isort
      if: hashFiles('**/*.py') != '' && (hashFiles('.isort.cfg', 'pyproject.toml', 'setup.cfg', 'tox.ini') != '' || hashFiles('.flake8') != '')
      run: pip install isort

    - name: Run flake8
      if: hashFiles('**/*.py') != '' && hashFiles('.flake8', 'setup.cfg', 'tox.ini') != ''
      run: flake8 . --max-line-length=88 --extend-ignore=E203,W503

    - name: Run black check
      if: hashFiles('**/*.py') != '' && hashFiles('pyproject.toml', '.black') != ''
      run: black --check .

    - name: Run isort check
      if: hashFiles('**/*.py') != '' && (hashFiles('.isort.cfg', 'pyproject.toml', 'setup.cfg', 'tox.ini') != '' || hashFiles('.flake8') != '')
      run: isort --check-only .

    # Go linting
    - name: Set up Go
      if: hashFiles('go.mod', '**/*.go') != ''
      uses: actions/setup-go@v5
      with:
        go-version: 'stable'
        cache: true

    - name: Run golangci-lint
      if: hashFiles('go.mod', '**/*.go') != ''
      uses: golangci/golangci-lint-action@v4
      with:
        version: latest

    # Rust linting
    - name: Set up Rust
      if: hashFiles('Cargo.toml') != ''
      uses: dtolnay/rust-toolchain@stable
      with:
        components: rustfmt, clippy

    - name: Cache Cargo registry
      if: hashFiles('Cargo.toml') != ''
      uses: actions/cache@v4
      with:
        path: |
          ~/.cargo/registry
          ~/.cargo/git
          target
        key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
        restore-keys: |
          ${{ runner.os }}-cargo-

    - name: Run rustfmt check
      if: hashFiles('Cargo.toml') != ''
      run: cargo fmt --all -- --check

    - name: Run clippy
      if: hashFiles('Cargo.toml') != ''
      run: cargo clippy --all-targets --all-features -- -D warnings
`;
