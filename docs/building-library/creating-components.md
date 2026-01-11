# Creating Components

Let's create reusable Vue components that are ready for distribution.

## Component Design Principles

When building library components, follow these principles:

1. **Props over hardcoded values** - Make components configurable
2. **Events for communication** - Use `emit` instead of direct parent manipulation
3. **Slots for flexibility** - Allow content customization
4. **TypeScript for safety** - Define prop types and emits

## Example: Button Component

Create `src/components/Button/Button.vue`:

```vue
<script setup lang="ts">
export interface ButtonProps {
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state */
  disabled?: boolean
  /** Loading state */
  loading?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--disabled': disabled, 'btn--loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

/* Sizes */
.btn--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

/* Variants */
.btn--primary {
  background: #42b883;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: #3aa876;
}

.btn--secondary {
  background: #35495e;
  color: white;
}

.btn--secondary:hover:not(:disabled) {
  background: #2c3e50;
}

.btn--outline {
  background: transparent;
  border-color: #42b883;
  color: #42b883;
}

.btn--outline:hover:not(:disabled) {
  background: #42b883;
  color: white;
}

.btn--ghost {
  background: transparent;
  color: #42b883;
}

.btn--ghost:hover:not(:disabled) {
  background: rgba(66, 184, 131, 0.1);
}

/* States */
.btn--disabled,
.btn--loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
```

Create the barrel export `src/components/Button/index.ts`:

```typescript
export { default as Button } from './Button.vue'
export type { ButtonProps } from './Button.vue'
```

## Example: Card Component

Create `src/components/Card/Card.vue`:

```vue
<script setup lang="ts">
export interface CardProps {
  /** Card title */
  title?: string
  /** Whether the card has a shadow */
  shadow?: boolean
  /** Whether the card is hoverable */
  hoverable?: boolean
}

withDefaults(defineProps<CardProps>(), {
  shadow: true,
  hoverable: false,
})
</script>

<template>
  <div
    :class="[
      'card',
      { 'card--shadow': shadow, 'card--hoverable': hoverable }
    ]"
  >
    <div v-if="title || $slots.header" class="card__header">
      <slot name="header">
        <h3 class="card__title">{{ title }}</h3>
      </slot>
    </div>
    <div class="card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.card--shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card--hoverable {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.card__header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.card__body {
  padding: 1.5rem;
}

.card__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}
</style>
```

## Update Main Export

Update `src/index.ts`:

```typescript
// Components
export { Button } from './components/Button'
export { Card } from './components/Card'

// Types
export type { ButtonProps } from './components/Button'
export type { CardProps } from './components/Card'

// Vue Plugin
import type { App } from 'vue'
import { Button } from './components/Button'
import { Card } from './components/Card'

export default {
  install(app: App) {
    app.component('VButton', Button)
    app.component('VCard', Card)
  },
}
```

## Testing Your Components Locally

Create a simple test page in `src/App.vue`:

```vue
<script setup lang="ts">
import { Button } from './components/Button'
import { Card } from './components/Card'
</script>

<template>
  <div style="padding: 2rem; font-family: system-ui;">
    <h1>Component Library Preview</h1>
    
    <section>
      <h2>Buttons</h2>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
    </section>

    <section style="margin-top: 2rem;">
      <h2>Cards</h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
        <Card title="Basic Card">
          <p>This is a basic card with a title.</p>
        </Card>
        <Card title="Hoverable Card" hoverable>
          <p>Hover over this card to see the effect.</p>
        </Card>
      </div>
    </section>
  </div>
</template>
```

Run the dev server:

```bash
npm run dev
```

## Next Steps

Now let's learn about [styling components](/building-library/styling-components) for better theming support.
