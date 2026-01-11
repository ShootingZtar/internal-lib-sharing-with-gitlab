# Documentation

Create comprehensive documentation for your component library.

## Documentation Options

| Tool | Best For |
|------|----------|
| **Storybook** | Interactive component playground |
| **VitePress** | Markdown-based documentation |
| **Histoire** | Vue-specific component stories |
| **Docusaurus** | Full documentation site |

## Storybook Setup

### Installation

```bash
npx storybook@latest init --type vue3
```

### Writing Stories

`src/components/Button/Button.stories.ts`:

```typescript
import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './Button.vue'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    default: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    default: 'Secondary Button',
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 1rem;">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    `,
  }),
}

export const Loading: Story = {
  args: {
    loading: true,
    default: 'Loading...',
  },
}
```

### Storybook Configuration

`.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config
```

## Histoire Setup (Vue-specific)

### Installation

```bash
npm install -D histoire @histoire/plugin-vue
```

### Configuration

`histoire.config.ts`:

```typescript
import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: './histoire.setup.ts',
})
```

### Writing Stories

`src/components/Button/Button.story.vue`:

```vue
<script setup lang="ts">
import Button from './Button.vue'

const variants = ['primary', 'secondary', 'outline', 'ghost'] as const
const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <Story title="Button">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect v-model="state.variant" :options="variants" title="Variant" />
        <HstSelect v-model="state.size" :options="sizes" title="Size" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.loading" title="Loading" />
        <HstText v-model="state.label" title="Label" />
      </template>

      <Button
        :variant="state.variant"
        :size="state.size"
        :disabled="state.disabled"
        :loading="state.loading"
      >
        {{ state.label }}
      </Button>
    </Variant>

    <Variant title="All Variants">
      <div style="display: flex; gap: 1rem;">
        <Button v-for="v in variants" :key="v" :variant="v">
          {{ v }}
        </Button>
      </div>
    </Variant>

    <Variant title="All Sizes">
      <div style="display: flex; gap: 1rem; align-items: center;">
        <Button v-for="s in sizes" :key="s" :size="s">
          {{ s }}
        </Button>
      </div>
    </Variant>
  </Story>
</template>
```

## API Documentation

### Using JSDoc

Document your components with JSDoc:

```vue
<script setup lang="ts">
/**
 * Button component for user interactions.
 * @displayName Button
 * @example
 * <Button variant="primary" @click="handleClick">Click Me</Button>
 */

export interface ButtonProps {
  /**
   * The visual style variant of the button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  
  /**
   * The size of the button.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

/**
 * Emitted when the button is clicked.
 * @param event - The native click event
 */
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

### Generate API Docs with vue-docgen-api

```bash
npm install -D vue-docgen-api
```

```typescript
// scripts/generate-docs.ts
import { parse } from 'vue-docgen-api'
import { writeFileSync } from 'fs'
import { glob } from 'glob'

async function generateDocs() {
  const files = await glob('src/components/**/*.vue')
  const docs = []

  for (const file of files) {
    const component = await parse(file)
    docs.push(component)
  }

  writeFileSync('docs/api.json', JSON.stringify(docs, null, 2))
}

generateDocs()
```

## README Template

Create a comprehensive README for your library:

```markdown
# @myorg/vue-components

A Vue 3 component library for MyOrg applications.

## Installation

\`\`\`bash
npm install @myorg/vue-components
\`\`\`

## Setup

\`\`\`typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@myorg/vue-components/style.css'

createApp(App).mount('#app')
\`\`\`

## Usage

\`\`\`vue
<script setup>
import { Button, Card } from '@myorg/vue-components'
</script>

<template>
  <Card title="Hello">
    <Button variant="primary">Click Me</Button>
  </Card>
</template>
\`\`\`

## Components

| Component | Description |
|-----------|-------------|
| Button | Clickable button with variants |
| Card | Container with header and footer |

## CSS Variables

Customize the library by overriding CSS variables:

\`\`\`css
:root {
  --lib-primary: #your-color;
}
\`\`\`

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

Proprietary - Internal use only
```

## Deploying Documentation

### GitLab Pages

`.gitlab-ci.yml`:

```yaml
pages:
  stage: deploy
  script:
    - npm ci
    - npm run build-storybook
    - mv storybook-static public
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

Your docs will be available at `https://myorg.gitlab.io/vue-components/`.

## Best Practices

:::tip Documentation Tips
- ✅ Write stories for all component states
- ✅ Include usage examples in JSDoc
- ✅ Document all props, events, and slots
- ✅ Show real-world usage patterns
- ✅ Keep docs updated with code changes
- ✅ Include migration guides for breaking changes
:::

## Conclusion

With proper documentation, your component library becomes much more valuable to your organization. Consider:

1. **Storybook** for interactive exploration
2. **JSDoc** for inline API documentation
3. **README** for quick start guides
4. **GitLab Pages** for hosting

Happy documenting! 📚
