# Project Setup

In this section, we'll set up a new Vue 3 component library project using Vite's library mode.

## Initialize the Project

Create a new Vue project with Vite:

```bash
npm create vite@latest my-vue-components -- --template vue-ts
cd my-vue-components
npm install
```

## Project Structure

Reorganize your project for library development:

```
my-vue-components/
├── src/
│   ├── components/           # Your components
│   │   ├── Button/
│   │   │   ├── Button.vue
│   │   │   └── index.ts
│   │   └── Card/
│   │       ├── Card.vue
│   │       └── index.ts
│   ├── index.ts              # Main entry point
│   └── types.ts              # Shared types
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Configure package.json

Update your `package.json` for library distribution:

```json
{
  "name": "@myorg/vue-components",
  "version": "0.1.0",
  "type": "module",
  "files": [
    "dist"
  ],
  "main": "./dist/my-vue-components.umd.cjs",
  "module": "./dist/my-vue-components.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/my-vue-components.js",
      "require": "./dist/my-vue-components.umd.cjs"
    },
    "./style.css": "./dist/style.css"
  },
  "sideEffects": [
    "**/*.css"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vite build && vue-tsc --emitDeclarationOnly",
    "preview": "vite preview"
  },
  "peerDependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "~5.3.0",
    "vite": "^5.0.0",
    "vue": "^3.4.0",
    "vue-tsc": "^1.8.0"
  }
}
```

:::info Package Naming
Use a scoped package name like `@myorg/vue-components`. This will map to your GitLab group or project namespace later.
:::

## Configure Vite for Library Mode

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyVueComponents',
      fileName: 'my-vue-components',
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ['vue'],
      output: {
        // Global vars for UMD build
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

## Configure TypeScript

Update `tsconfig.json` to emit declaration files:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "declaration": true,
    "declarationDir": "./dist",
    "emitDeclarationOnly": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

## Create the Entry Point

Create `src/index.ts`:

```typescript
// Export all components
export { default as Button } from './components/Button/Button.vue'
export { default as Card } from './components/Card/Card.vue'

// Export types
export * from './types'

// Plugin for global registration (optional)
import type { App } from 'vue'
import Button from './components/Button/Button.vue'
import Card from './components/Card/Card.vue'

export default {
  install(app: App) {
    app.component('MyButton', Button)
    app.component('MyCard', Card)
  },
}
```

## Install Dependencies

```bash
npm install
```

## Verify Setup

Build the library to ensure everything is configured correctly:

```bash
npm run build
```

You should see output files in the `dist/` directory:
- `my-vue-components.js` - ES module
- `my-vue-components.umd.cjs` - UMD module
- `style.css` - Extracted styles
- `index.d.ts` - TypeScript declarations

## Next Steps

Now that your project is set up, let's [create some components](/building-library/creating-components).
