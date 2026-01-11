# Building for Distribution

Configure your build process for optimal distribution.

## Build Configuration

### Vite Library Mode

Complete `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyVueComponents',
      fileName: (format) => `my-vue-components.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'style.css'
          }
          return assetInfo.name!
        },
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
})
```

Install the types plugin:

```bash
npm install -D vite-plugin-dts
```

## Type Generation

### Option 1: vite-plugin-dts (Recommended)

Already configured above. This plugin:
- Generates `.d.ts` files for all exports
- Bundles type declarations
- Handles Vue SFC types

### Option 2: Manual TypeScript

Use `vue-tsc` directly:

```json
{
  "scripts": {
    "build": "vite build",
    "build:types": "vue-tsc --declaration --emitDeclarationOnly --outDir dist/types",
    "build:all": "npm run build && npm run build:types"
  }
}
```

## Package.json Exports

Modern package.json with full exports:

```json
{
  "name": "@myorg/vue-components",
  "version": "1.0.0",
  "type": "module",
  "files": [
    "dist"
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
    "./style.css": {
      "import": "./dist/style.css",
      "require": "./dist/style.css"
    }
  },
  "sideEffects": [
    "**/*.css"
  ],
  "peerDependencies": {
    "vue": "^3.4.0"
  }
}
```

## Build Output

After running `npm run build`, you should have:

```
dist/
├── my-vue-components.es.js      # ES module (modern bundlers)
├── my-vue-components.umd.js     # UMD (browsers, Node.js)
├── index.d.ts                   # Type declarations
└── style.css                    # Extracted styles
```

## Tree Shaking

Ensure your library supports tree shaking:

### 1. Use Named Exports

```typescript
// ✅ Good - tree-shakeable
export { Button } from './components/Button'
export { Card } from './components/Card'

// ❌ Bad - not tree-shakeable
export default { Button, Card }
```

### 2. Mark Side Effects

```json
{
  "sideEffects": [
    "**/*.css",
    "**/*.scss"
  ]
}
```

### 3. Preserve Modules (Optional)

For maximum tree shaking, preserve the module structure:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
})
```

## Pre-publish Checklist

Before publishing, verify:

- [ ] `npm run build` succeeds without errors
- [ ] All exports are properly typed
- [ ] CSS is extracted correctly
- [ ] `package.json` has correct entry points
- [ ] No development dependencies in `dependencies`
- [ ] `files` array includes only necessary files
- [ ] Version number is updated

## Testing the Build Locally

Use `npm pack` to test what will be published:

```bash
npm pack --dry-run
```

Or create a tarball and test installation:

```bash
npm pack
# Creates myorg-vue-components-1.0.0.tgz

# In another project:
npm install ../path/to/myorg-vue-components-1.0.0.tgz
```

## Next Steps

Your library is built! Now let's [set up GitLab registry](/publishing/gitlab-registry-setup) for publishing.
