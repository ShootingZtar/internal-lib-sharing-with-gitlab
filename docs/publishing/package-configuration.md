# Package Configuration

Configure your `package.json` for GitLab registry publishing.

## Required Fields

### Package Name with Scope

Your package name must match your GitLab namespace:

```json
{
  "name": "@myorg/vue-components"
}
```

| GitLab Entity | Package Scope |
|---------------|---------------|
| Group: `myorg` | `@myorg/*` |
| User: `johndoe` | `@johndoe/*` |

### Publish Configuration

Add `publishConfig` to specify the registry:

```json
{
  "name": "@myorg/vue-components",
  "version": "1.0.0",
  "publishConfig": {
    "@myorg:registry": "https://gitlab.com/api/v4/projects/12345678/packages/npm/"
  }
}
```

For **group-level** publishing:

```json
{
  "publishConfig": {
    "@myorg:registry": "https://gitlab.com/api/v4/groups/12345/-/packages/npm/"
  }
}
```

## Complete package.json Example

```json
{
  "name": "@myorg/vue-components",
  "version": "1.0.0",
  "description": "Shared Vue 3 component library for MyOrg",
  "author": "MyOrg Team",
  "license": "UNLICENSED",
  "repository": {
    "type": "git",
    "url": "https://gitlab.com/myorg/vue-components.git"
  },
  "homepage": "https://gitlab.com/myorg/vue-components",
  "bugs": {
    "url": "https://gitlab.com/myorg/vue-components/-/issues"
  },
  "keywords": [
    "vue",
    "components",
    "ui",
    "myorg"
  ],
  "type": "module",
  "files": [
    "dist",
    "README.md"
  ],
  "main": "./dist/my-vue-components.umd.js",
  "module": "./dist/my-vue-components.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/my-vue-components.es.js",
      "require": "./dist/my-vue-components.umd.js"
    },
    "./style.css": "./dist/style.css"
  },
  "sideEffects": [
    "**/*.css"
  ],
  "publishConfig": {
    "@myorg:registry": "https://gitlab.com/api/v4/groups/12345/-/packages/npm/"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "~5.3.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.7.0",
    "vue": "^3.4.0",
    "vue-tsc": "^1.8.0"
  }
}
```

## Important Fields Explained

### `files`

Specifies which files to include in the published package:

```json
{
  "files": [
    "dist",
    "README.md"
  ]
}
```

:::tip
Use `npm pack --dry-run` to preview what will be published.
:::

### `license`

For internal packages:

```json
{
  "license": "UNLICENSED"
}
```

Or use `"private": true` to prevent accidental publishing to npm:

```json
{
  "private": false,
  "license": "UNLICENSED"
}
```

### `peerDependencies`

List Vue as a peer dependency (not bundled):

```json
{
  "peerDependencies": {
    "vue": "^3.4.0"
  }
}
```

### `prepublishOnly`

Automatically build before publishing:

```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

## .npmignore vs files

You can use either `.npmignore` or the `files` field:

### Using `files` (Recommended)

Whitelist approach - only specified files are included:

```json
{
  "files": ["dist", "README.md"]
}
```

### Using `.npmignore`

Blacklist approach - all files except specified are included:

```
# .npmignore
src/
node_modules/
*.config.ts
*.config.js
.env*
```

## Create a Local .npmrc

Create `.npmrc` in your project root:

```ini
# Scoped registry for @myorg packages
@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/

# Authentication - use environment variable
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
```

## Add to .gitignore

Ensure sensitive files aren't committed:

```gitignore
# Dependencies
node_modules/

# Build output (optional - some prefer to commit)
dist/

# Environment
.env
.env.local

# npm config with tokens
.npmrc
```

## Validate Your Configuration

Run these commands to verify:

```bash
# Check what will be published
npm pack --dry-run

# Verify package.json is valid
npm pkg get name version main module types exports
```

## Next Steps

Ready to publish! Follow the [publishing workflow](/publishing/publishing-workflow).
