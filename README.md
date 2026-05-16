# gh-workflow-gen

**CLI tool to scaffold common GitHub Actions workflows in seconds.**

Stop copying YAML from old projects. Generate production-ready GitHub Actions workflows with an interactive CLI.

## Features

- **5 battle-tested templates** for the most common CI/CD tasks
- **Interactive prompts** — no flags to remember
- **Smart defaults** — works out of the box
- **Validates filenames** — prevents broken workflow names
- **Safe overwrite protection** — won't clobber existing workflows without confirmation

## Installation

```bash
npm install -g gh-workflow-gen
```

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

## Premium Template Pack 💎

Need advanced workflows for production deployments? The **[Premium Template Pack](./PREMIUM.md)** includes 7 production-ready templates:

- **AWS Lambda Deploy** — Automated Lambda deployment with OIDC, multi-environment, smoke tests
- **Terraform Plan/Apply** — Infrastructure changes with drift detection and approval gates
- **Kubernetes Deploy** — Helm charts, kubectl, rolling updates, secrets management
- **Multi-Stage Deploy** — Dev → Staging → Prod pipeline with approvals and rollback
- **Monorepo CI** — Nx/Turborepo cache integration with affected project detection
- **Security Scanning** — Trivy, Snyk, CodeQL, and license compliance
- **E2E Testing** — Playwright/Cypress with parallelization and visual regression

**Price:** $9 (one-time) | **[Learn more →](./PREMIUM.md)**

## Roadmap

- Custom template support (bring your own YAML snippets)
- Template variables (inject repo-specific values)
- Interactive template editor

## Support This Project

If this tool saved you time, consider supporting its development:

- **Bitcoin:** `bc1qt0wawff05van54vuasqu9sluzymuhhpl3l2z3k`
- **Ethereum:** `0x538AFaB14652792fA31a58F16c1d85191FAFC30E`

Every contribution helps us build better tools for developers.

## License

MIT © Ironbond LLC

## Feedback

Found a bug or have a template request? [Open an issue](https://github.com/Joe0/gh-workflow-gen/issues).
