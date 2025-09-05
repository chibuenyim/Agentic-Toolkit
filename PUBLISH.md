# Publishing Guide

## Prerequisites

1. Create an npm account at https://www.npmjs.com/
2. Generate an access token with "Automation" scope
3. Add the token to your GitHub repository secrets as `NPM_TOKEN`

## Publishing Process

1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Commit changes: `git commit -m "chore: prepare v1.x.x"`
4. Create tag: `git tag v1.x.x`
5. Push tag: `git push origin v1.x.x`
6. GitHub Actions will automatically publish to npm

## Manual Publishing

If needed, publish manually:

```bash
npm login
npm publish --access public
```

## Post-Publish

- Verify package on npm
- Create GitHub release if not automated
- Update documentation if necessary
