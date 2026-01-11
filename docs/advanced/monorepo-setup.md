# Monorepo Setup

Manage multiple packages in a single repository.

## Why Monorepo?

Benefits for component libraries:
- **Shared tooling** - Single ESLint, TypeScript, Vite config
- **Atomic changes** - Update multiple packages in one commit
- **Easier testing** - Test integration between packages
- **Simplified dependencies** - Share dependencies across packages

## Tools Overview

| Tool | Best For |
|------|----------|
| **pnpm workspaces** | Simple setup, fast, disk efficient |
| **npm workspaces** | Native npm support |
| **Turborepo** | Build caching, task orchestration |
| **Lerna** | Publishing, versioning |

## pnpm Workspaces Setup

### Project Structure

```
my-component-library/
├── packages/
│   ├── core/           # @myorg/core
│   │   ├── src/
│   │   └── package.json
│   ├── vue-components/ # @myorg/vue-components  
│   │   ├── src/
│   │   └── package.json
│   └── themes/         # @myorg/themes
│       ├── src/
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### Root package.json

```json
{
  "name": "my-component-library",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "publish-packages": "pnpm -r publish"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.3.0"
  }
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

### Individual Package

`packages/vue-components/package.json`:

```json
{
  "name": "@myorg/vue-components",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "@myorg/core": "workspace:*"
  },
  "peerDependencies": {
    "vue": "^3.4.0"
  },
  "publishConfig": {
    "@myorg:registry": "https://gitlab.com/api/v4/groups/12345/-/packages/npm/"
  }
}
```

## Turborepo Configuration

`turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Inter-package Dependencies

Use workspace protocol for local dependencies:

```json
{
  "dependencies": {
    "@myorg/core": "workspace:*",
    "@myorg/themes": "workspace:^1.0.0"
  }
}
```

During publish, `workspace:*` becomes the actual version.

## Publishing Monorepo Packages

### With pnpm

```bash
# Publish all changed packages
pnpm -r publish --filter "...[origin/main]"

# Publish specific package
pnpm --filter @myorg/vue-components publish
```

### With Changesets

Install:

```bash
pnpm add -D @changesets/cli
pnpm changeset init
```

Create a changeset:

```bash
pnpm changeset
```

Version and publish:

```bash
pnpm changeset version
pnpm -r publish
```

## GitLab CI for Monorepo

`.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - publish

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"

default:
  image: node:20
  before_script:
    - corepack enable
    - pnpm install --frozen-lockfile

test:
  stage: test
  script:
    - pnpm run lint
    - pnpm run test
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

build:
  stage: build
  script:
    - pnpm run build
  artifacts:
    paths:
      - packages/*/dist/
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+/

publish:
  stage: publish
  script:
    - |
      echo "@myorg:registry=https://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/" >> .npmrc
      echo "//${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
    - pnpm -r publish --no-git-checks
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+/
  needs:
    - build
```

## Shared Configuration

### Shared TypeScript Config

`tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

Package-level `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### Shared Vite Config

`packages/vue-components/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import baseConfig from '../../vite.config.base'

export default defineConfig({
  ...baseConfig,
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueComponents',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@myorg/core'],
    },
  },
})
```

## Best Practices

:::tip Recommendations
- Use **pnpm** for disk-efficient dependency management
- Use **Turborepo** for build caching and task orchestration
- Use **Changesets** for version management
- Share base configs across packages
- Keep packages focused and single-purpose
:::

## Next Steps

Learn about [documentation generation](/advanced/documentation) for your library.
