export const pythonCi = `name: Python CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        python-version: ['3.9', '3.10', '3.11', '3.12', '3.13']

    steps:
    - uses: actions/checkout@v4

    - name: Set up Python \${{ matrix.python-version }}
      uses: actions/setup-python@v5
      with:
        python-version: \${{ matrix.python-version }}
        cache: 'pip'

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
        if [ -f requirements-dev.txt ]; then pip install -r requirements-dev.txt; fi

    - name: Run linter
      run: |
        # Only run flake8 if project uses it (has config or in requirements)
        if [ -f .flake8 ] || [ -f setup.cfg ] || grep -q flake8 requirements*.txt 2>/dev/null; then
          pip install flake8
          # Stop on syntax errors or undefined names
          flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
          # Full lint (exit-zero treats all errors as warnings)
          flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
        else
          echo "No flake8 config found, skipping linter"
        fi

    - name: Run tests with coverage
      run: |
        pip install pytest pytest-cov
        pytest --cov=. --cov-report=term-missing --cov-report=xml

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v4
      with:
        files: ./coverage.xml
        fail_ci_if_error: false
`;
