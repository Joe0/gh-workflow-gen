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

    - name: Create Git tag
      run: |
        git config user.name "github-actions[bot]"
        git config user.email "github-actions[bot]@users.noreply.github.com"
        git tag -a "\${{ inputs.version }}" -m "Release \${{ inputs.version }}"
        git push origin "\${{ inputs.version }}"

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
        # Uncomment to attach artifacts:
        # files: |
        #   dist.tar.gz
        #   *.zip
`;
