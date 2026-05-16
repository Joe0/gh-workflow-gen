# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-16

### Added
- Initial release of gh-workflow-gen
- Interactive CLI for generating GitHub Actions workflow files
- 5 free workflow templates:
  - Node.js CI: Multi-version matrix testing (Node 18, 20, 22)
  - Docker Build/Push: Build and push to GitHub Container Registry with Buildx
  - Python CI: Multi-version matrix testing (Python 3.9-3.12)
  - Lint: ESLint and Prettier formatting checks
  - Manual Release: Manually triggered release workflow with version validation
- Built with TypeScript, Commander.js, and Inquirer.js
- MIT license
- Comprehensive documentation
