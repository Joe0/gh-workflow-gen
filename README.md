# gh-workflow-gen

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

**CLI tool to scaffold common GitHub Actions workflows in seconds.**

Stop copying YAML from old projects. Generate production-ready GitHub Actions workflows with an interactive CLI.

## Features

- **5 battle-tested templates** for the most common CI/CD tasks
- **Interactive prompts** — no flags to remember
- **Smart defaults** — works out of the box
- **Validates filenames** — prevents broken workflow names
- **Safe overwrite protection** — won't clobber existing workflows without confirmation

## Installation

Install directly from the GitHub repo (no npm registry account needed):

```bash
npm install -g github:Joe0/gh-workflow-gen
```

Or run on-demand with npx:

```bash
npx github:Joe0/gh-workflow-gen generate
```

> The package is intended to live at `@ironbond/gh-workflow-gen` on npm. Until that publish path is unblocked, install from the source repo as shown above — it builds locally on install.

## Usage

```bash
gh-workflow-gen generate
# or shorthand:
gh-workflow-gen gen
```

The CLI will prompt you to:
1. Select a workflow template
2. Choose a filename (defaults to template name)
3. Confirm if overwriting an existing file

The workflow file will be created at `.github/workflows/{filename}.yml` in your current directory.

## Available Templates (Free)

### 1. Node.js CI
**When to use:** Testing Node.js projects across multiple versions

Includes:
- Matrix testing (Node 18, 20, 22)
- Dependency caching
- Runs on push/PR to main

**Generated workflow:**
```yaml
name: Node.js CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm test
```

### 2. Python CI
**When to use:** Testing Python projects across multiple versions

Includes:
- Matrix testing (Python 3.9, 3.10, 3.11, 3.12)
- pip dependency caching
- pytest execution
- Runs on push/PR to main

### 3. Docker Build & Push
**When to use:** Building and pushing Docker images to GitHub Container Registry

Includes:
- Docker Buildx with layer caching
- Automatic tagging (`:latest` + `:sha-{short-sha}`)
- Pushes to `ghcr.io/{owner}/{repo}`
- Runs on push to main

**Example output:** `ghcr.io/yourorg/yourrepo:latest`, `ghcr.io/yourorg/yourrepo:sha-a1b2c3d`

### 4. Basic Linting
**When to use:** Running ESLint + Prettier on every commit

Includes:
- Node.js 20 setup
- npm ci + lint script execution
- Runs on push/PR to main

### 5. Manual Release Trigger
**When to use:** Creating releases on-demand with version input

Includes:
- `workflow_dispatch` trigger with version input
- Semantic version validation (v1.2.3 format)
- Outputs the provided version for downstream steps

**How to use:** Go to Actions tab → Select "Manual Release" → Click "Run workflow" → Enter version → Run

## Requirements

- Node.js 18 or higher
- A Git repository (workflows are generated in `.github/workflows/`)

## Examples

### Quick start in an existing project
```bash
cd my-project
gh-workflow-gen gen
# Select "Node.js CI (test + build)"
# Accept default filename "node-ci"
# ✓ Generated workflow: .github/workflows/node-ci.yml
```

### Add Docker build to a microservice
```bash
cd my-api
gh-workflow-gen gen
# Select "Docker Build & Push"
# Enter filename: "docker-build"
# ✓ Generated workflow: .github/workflows/docker-build.yml
```

### Create a manual release workflow
```bash
gh-workflow-gen gen
# Select "Manual Release Trigger"
# Enter filename: "release"
# ✓ Generated workflow: .github/workflows/release.yml
```

## Roadmap

- Custom template support (bring your own YAML snippets)
- Template variables (inject repo-specific values)
- Interactive template editor

## Support This Project

If this tool saved you time, consider supporting its development:

- **Bitcoin:** `bc1q0rv04u4nv9704tzy8rzgp7pl68pduhlvpf2hs4`
- **Ethereum:** `0xCc26a40630600ffD744E3F2BAd1B904Bb9f8Df37`

Every contribution helps us build better tools for developers.

## License

MIT © Ironbond

## About Ironbond

Built by [Ironbond](https://ironbond.net), an autonomous AI agent operating under Joe Pritzel's direction. Code is real, tested, MIT-licensed. The tip jar exists but is not the business model — see [ironbond.net](https://ironbond.net) for what is.

## Feedback

Found a bug or have a template request? [Open an issue](https://github.com/Joe0/gh-workflow-gen/issues).
