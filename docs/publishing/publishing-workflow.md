# Publishing Workflow

Step-by-step guide to publish your library to GitLab Package Registry.

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass
- [ ] Version number is updated
- [ ] Build succeeds (`npm run build`)
- [ ] Types are generated correctly
- [ ] README is up to date
- [ ] CHANGELOG is updated (if applicable)
- [ ] `.npmrc` is configured with correct registry

## Manual Publishing

### Step 1: Set Authentication

Set your GitLab token:

```bash
export GITLAB_NPM_TOKEN="glpat-xxxxxxxxxxxx"
```

Or add to your `.npmrc`:

```ini
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=glpat-xxxxxxxxxxxx
```

### Step 2: Build the Package

```bash
npm run build
```

Verify the build output:

```bash
ls -la dist/
```

### Step 3: Update Version

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### Step 4: Publish

```bash
npm publish
```

You should see:

```
npm notice
npm notice 📦  @myorg/vue-components@1.0.0
npm notice === Tarball Contents ===
npm notice 1.2kB  README.md
npm notice 15.3kB dist/my-vue-components.es.js
npm notice 12.1kB dist/my-vue-components.umd.js
npm notice 2.5kB  dist/style.css
npm notice 1.1kB  dist/index.d.ts
npm notice === Tarball Details ===
npm notice name:          @myorg/vue-components
npm notice version:       1.0.0
npm notice filename:      myorg-vue-components-1.0.0.tgz
npm notice package size:  8.5 kB
npm notice unpacked size: 32.2 kB
npm notice total files:   5
npm notice
+ @myorg/vue-components@1.0.0
```

## Verify Publication

### In GitLab UI

1. Go to your project/group
2. Navigate to **Deploy** → **Package Registry**
3. Find your package in the list

### Via npm

```bash
npm view @myorg/vue-components --registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/
```

## Publishing Tags

### Beta/Pre-release Versions

```bash
# Update to pre-release version
npm version 1.1.0-beta.1

# Publish with beta tag
npm publish --tag beta
```

### Latest (Default)

```bash
npm publish --tag latest
```

### Moving Tags

```bash
# Make a specific version the latest
npm dist-tag add @myorg/vue-components@1.0.5 latest
```

## Unpublishing (with caution)

:::danger Warning
Unpublishing can break dependent projects. Only unpublish if absolutely necessary.
:::

GitLab allows unpublishing packages:

```bash
npm unpublish @myorg/vue-components@1.0.0
```

Or via GitLab UI:
1. Go to **Deploy** → **Package Registry**
2. Find the package version
3. Click **Delete**

## Common Errors

### "You cannot publish over the previously published version"

You're trying to publish an existing version. Update the version number:

```bash
npm version patch
npm publish
```

### "E401 Unauthorized"

Authentication issue:
- Check your token is valid
- Verify token has `write_registry` scope
- Ensure `.npmrc` is configured correctly

### "E403 Forbidden"

Permission issue:
- Verify you have Maintainer+ role in the project
- Check Package Registry is enabled in project settings

## Publish Script

Create a helper script `scripts/publish.sh`:

```bash
#!/bin/bash
set -e

# Ensure we're on main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Must be on main branch to publish"
  exit 1
fi

# Ensure working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working directory is not clean"
  exit 1
fi

# Build
echo "📦 Building..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

# Publish
echo "🚀 Publishing..."
npm publish

# Push tags
echo "📌 Pushing tags..."
git push --tags

echo "✅ Published successfully!"
```

## Next Steps

Learn about [versioning strategies](/publishing/versioning-strategy) for managing releases.
