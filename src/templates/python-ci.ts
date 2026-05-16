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
        # Check for ruff (modern fast linter) first, fall back to flake8
        if [ -f ruff.toml ] || [ -f pyproject.toml ] || grep -q ruff requirements*.txt 2>/dev/null; then
          pip install ruff
          ruff check .
        elif [ -f .flake8 ] || [ -f setup.cfg ] || grep -q flake8 requirements*.txt 2>/dev/null; then
          pip install flake8
          # Stop on syntax errors or undefined names
          flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
          # Full lint (exit-zero treats all errors as warnings)
          flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
        else
          echo "No linter config found (ruff/flake8), skipping linter"
        fi

    - name: Run tests with coverage
      run: |
        pip install pytest pytest-cov
        # Auto-detect coverage path: use src/ if it exists, else current dir
        if [ -d src ]; then
          COV_PATH="src"
        elif [ -f setup.py ] || [ -f pyproject.toml ]; then
          # Try to extract package name from setup.py or pyproject.toml
          COV_PATH=\$(python -c "import tomli; print(tomli.load(open('pyproject.toml','rb'))['project']['name'])" 2>/dev/null || echo ".")
        else
          COV_PATH="."
        fi
        pytest --cov=\$COV_PATH --cov-report=term-missing --cov-report=xml

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v4
      with:
        files: ./coverage.xml
        fail_ci_if_error: false
        # To enable Codecov uploads:
        # 1. Sign up at https://codecov.io and link your repository
        # 2. Add CODECOV_TOKEN to your GitHub repo secrets (Settings > Secrets > Actions)
        # 3. Uncomment the token line below
        # token: \${{ secrets.CODECOV_TOKEN }}
`;
