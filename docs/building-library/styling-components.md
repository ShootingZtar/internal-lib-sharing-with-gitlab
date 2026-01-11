# Styling Components

Learn how to style your components for flexibility and theming.

## CSS Custom Properties

Use CSS custom properties (variables) for theming:

```vue
<style scoped>
.btn {
  --btn-bg: var(--lib-primary, #42b883);
  --btn-color: var(--lib-primary-contrast, white);
  --btn-radius: var(--lib-radius, 0.5rem);
  
  background: var(--btn-bg);
  color: var(--btn-color);
  border-radius: var(--btn-radius);
}
</style>
```

Consumers can customize by defining the variables:

```css
:root {
  --lib-primary: #6366f1;
  --lib-primary-contrast: white;
  --lib-radius: 0.25rem;
}
```

## CSS Extraction Strategy

### Option 1: Scoped Styles (Default)

Styles are extracted to a single CSS file:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    cssCodeSplit: false, // All CSS in one file
  },
})
```

Users import: 
```typescript
import '@myorg/vue-components/style.css'
```

### Option 2: Component-level CSS

For tree-shaking CSS, use separate style files:

```
src/components/Button/
├── Button.vue
├── Button.css
└── index.ts
```

```typescript
// Button/index.ts
export { default as Button } from './Button.vue'
import './Button.css'
```

## Dark Mode Support

Use CSS media queries or class-based dark mode:

```vue
<style scoped>
.card {
  background: var(--card-bg, white);
  color: var(--card-text, #1f2937);
}

/* Media query approach */
@media (prefers-color-scheme: dark) {
  .card {
    --card-bg: #1f2937;
    --card-text: #f3f4f6;
  }
}

/* Or class-based approach */
:global(.dark) .card {
  --card-bg: #1f2937;
  --card-text: #f3f4f6;
}
</style>
```

## Avoiding Style Conflicts

### 1. Use BEM Naming Convention

```vue
<template>
  <div class="my-card">
    <div class="my-card__header">
      <h3 class="my-card__title">{{ title }}</h3>
    </div>
    <div class="my-card__body">
      <slot />
    </div>
  </div>
</template>
```

### 2. Add a Namespace Prefix

```vue
<style scoped>
/* Prefix all classes with your library name */
.vlib-btn { }
.vlib-card { }
.vlib-input { }
</style>
```

### 3. Use CSS Modules

```vue
<template>
  <button :class="$style.btn">
    <slot />
  </button>
</template>

<style module>
.btn {
  /* styles */
}
</style>
```

## Design Tokens

Create a centralized token system:

```typescript
// src/tokens.ts
export const tokens = {
  colors: {
    primary: '#42b883',
    secondary: '#35495e',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
}
```

Generate CSS variables:

```typescript
// src/css-tokens.ts
import { tokens } from './tokens'

export function generateCSSVariables(): string {
  const lines: string[] = [':root {']
  
  Object.entries(tokens.colors).forEach(([key, value]) => {
    lines.push(`  --lib-color-${key}: ${value};`)
  })
  
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    lines.push(`  --lib-spacing-${key}: ${value};`)
  })
  
  lines.push('}')
  return lines.join('\n')
}
```

## Best Practices

:::tip Do's
- ✅ Use CSS custom properties for theming
- ✅ Provide sensible defaults
- ✅ Support both light and dark modes
- ✅ Use scoped styles to prevent leaks
- ✅ Document available CSS variables
:::

:::caution Don'ts
- ❌ Don't use `!important` unless absolutely necessary
- ❌ Don't rely on global styles
- ❌ Don't use overly generic class names
- ❌ Don't hardcode colors without variable fallbacks
:::

## Next Steps

Learn how to [build for distribution](/building-library/building-for-distribution).
