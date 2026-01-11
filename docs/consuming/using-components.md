# Using Components

How to use your published Vue component library in applications.

## Import Styles

First, import the component styles in your main entry file:

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// Import component library styles
import '@myorg/vue-components/style.css'

createApp(App).mount('#app')
```

## Usage Options

### Option 1: Direct Imports (Recommended)

Import components directly where needed:

```vue
<script setup lang="ts">
import { Button, Card } from '@myorg/vue-components'
</script>

<template>
  <Card title="Welcome">
    <p>Hello from the component library!</p>
    <template #footer>
      <Button variant="primary">Get Started</Button>
    </template>
  </Card>
</template>
```

**Benefits:**
- Tree-shakeable - only used components are bundled
- Clear dependencies per component
- Better IDE support

### Option 2: Global Registration

Register all components globally using the plugin:

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import MyComponents from '@myorg/vue-components'
import '@myorg/vue-components/style.css'

const app = createApp(App)
app.use(MyComponents)
app.mount('#app')
```

Then use without imports:

```vue
<template>
  <VCard title="Welcome">
    <p>Components are globally available!</p>
    <VButton>Click Me</VButton>
  </VCard>
</template>
```

**Note:** Global registration means all components are included in your bundle.

### Option 3: Selective Global Registration

Register only specific components globally:

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { Button, Card } from '@myorg/vue-components'
import '@myorg/vue-components/style.css'

const app = createApp(App)

// Register with custom names
app.component('MyButton', Button)
app.component('MyCard', Card)

app.mount('#app')
```

## TypeScript Support

If the library includes type declarations, you get full TypeScript support:

```vue
<script setup lang="ts">
import { Button, type ButtonProps } from '@myorg/vue-components'

// Types are available
const buttonVariant: ButtonProps['variant'] = 'primary'
</script>
```

### Augmenting Global Components

If using global registration, add type declarations:

```typescript
// src/components.d.ts
import { Button, Card } from '@myorg/vue-components'

declare module 'vue' {
  export interface GlobalComponents {
    VButton: typeof Button
    VCard: typeof Card
  }
}
```

## Customizing Styles

### Using CSS Variables

Override the library's CSS variables:

```css
/* Your app's CSS */
:root {
  /* Override library variables */
  --lib-primary: #6366f1;
  --lib-primary-contrast: white;
  --lib-radius: 0.25rem;
}
```

### Scoped Overrides

Override styles for specific instances:

```vue
<template>
  <Button class="custom-button">Custom Styled</Button>
</template>

<style scoped>
.custom-button {
  --btn-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
```

### Deep Selectors

Target internal elements (use sparingly):

```vue
<style scoped>
.my-card :deep(.card__header) {
  background: #f0f0f0;
}
</style>
```

## Handling Events

```vue
<script setup lang="ts">
import { Button } from '@myorg/vue-components'

const handleClick = (event: MouseEvent) => {
  console.log('Button clicked!', event)
}
</script>

<template>
  <Button @click="handleClick">Click Me</Button>
</template>
```

## Using Slots

```vue
<script setup lang="ts">
import { Card } from '@myorg/vue-components'
</script>

<template>
  <Card>
    <!-- Custom header -->
    <template #header>
      <div class="custom-header">
        <h2>Custom Title</h2>
        <span class="badge">New</span>
      </div>
    </template>

    <!-- Default slot (body) -->
    <p>Card content goes here.</p>

    <!-- Footer slot -->
    <template #footer>
      <div class="actions">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </template>
  </Card>
</template>
```

## Example: Complete Page

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card } from '@myorg/vue-components'

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  loading.value = false
}
</script>

<template>
  <div class="page">
    <h1>Dashboard</h1>
    
    <div class="grid">
      <Card title="Statistics" hoverable>
        <div class="stat">
          <span class="stat-value">1,234</span>
          <span class="stat-label">Total Users</span>
        </div>
      </Card>

      <Card title="Quick Actions">
        <div class="actions">
          <Button variant="primary" size="sm">New Project</Button>
          <Button variant="outline" size="sm">View Reports</Button>
        </div>
      </Card>

      <Card title="Settings">
        <p>Configure your preferences</p>
        <template #footer>
          <Button 
            variant="primary" 
            :loading="loading"
            @click="handleSubmit"
          >
            Save Changes
          </Button>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--lib-primary, #42b883);
}

.stat-label {
  display: block;
  color: #666;
  margin-top: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
```

## Next Steps

Explore [CI/CD automation](/advanced/ci-cd-automation) for automated publishing.
