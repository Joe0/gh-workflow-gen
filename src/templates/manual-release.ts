export const manualRelease = `name: Manual Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Release version (e.g., v1.2.3)'
        required: true
        type: string
      prerelease:
        description: 'Mark as pre-release'
        required: false
        type: boolean
        default: false

jobs:
  release:
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0  # Fetch all tags

    - name: Validate version format
      run: |
        if [[ ! "\${{ inputs.version }}" =~ ^v[0-9]+\\.[0-9]+\\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
          echo "Error: Version must be in format vX.Y.Z or vX.Y.Z-suffix"
          exit 1
        fi

    - name: Check if tag exists
      run: |
        if git rev-parse "\${{ inputs.version }}" >/dev/null 2>&1; then
          echo "Error: Tag \${{ inputs.version }} already exists"
          exit 1
        fi

    - name: Check for uncommitted changes
      run: |
        if [[ -n "\$(git status --porcelain)" ]]; then
          echo "Error: Working directory has uncommitted changes"
          echo "Commit or stash changes before creating a release"
          exit 1
        fi

    # Note: Update version in package.json/Cargo.toml/pyproject.toml BEFORE triggering this workflow
    # This workflow creates the tag from the current commit, it does not modify version files

    - name: Create Git tag
      run: |
        git config user.name "github-actions[bot]"
        git config user.email "github-actions[bot]@users.noreply.github.com"
        git tag -a "\${{ inputs.version }}" -m "Release \${{ inputs.version }}"
        git push origin "\${{ inputs.version }}"

    # Optional: Generate changelog from commits
    # - name: Generate changelog
    #   id: changelog
    #   run: |
    #     PREV_TAG=\$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")
    #     if [[ -n "$PREV_TAG" ]]; then
    #       echo "changes<<EOF" >> $GITHUB_OUTPUT
    #       git log \${PREV_TAG}..HEAD --pretty=format:"- %s (%h)" >> $GITHUB_OUTPUT
    #       echo "EOF" >> $GITHUB_OUTPUT
    #     fi

    # Optional: Build and upload artifacts
    # - name: Build release artifacts
    #   run: npm run build  # or your build command
    #
    # - name: Package artifacts
    #   run: tar -czf dist.tar.gz dist/

    - name: Create GitHub Release
      uses: softprops/action-gh-release@v2
      with:
        tag_name: \${{ inputs.version }}
        name: Release \${{ inputs.version }}
        draft: false
        prerelease: \${{ inputs.prerelease }}
        generate_release_notes: true
        # body: \${{ steps.changelog.outputs.changes }}  # Use if changelog step enabled
        # Uncomment to attach artifacts:
        # files: |
        #   dist.tar.gz
        #   *.zip
`;
