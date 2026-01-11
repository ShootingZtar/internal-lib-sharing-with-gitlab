# Versioning Strategy

Establish a consistent versioning approach for your component library.

## Semantic Versioning (SemVer)

Follow [Semantic Versioning](https://semver.org/) - `MAJOR.MINOR.PATCH`:

| Type | When to Increment | Example |
|------|-------------------|---------|
| **MAJOR** | Breaking changes | Renamed component, removed prop |
| **MINOR** | New features (backward compatible) | Added new component, new prop |
| **PATCH** | Bug fixes | Fixed styling issue, typo fix |

## Examples

### MAJOR (Breaking Change)

```diff
// Before (v1.x.x)
<Button color="primary">Click</Button>

// After (v2.0.0) - prop renamed
<Button variant="primary">Click</Button>
```

### MINOR (New Feature)

```diff
// v1.0.0
<Button variant="primary">Click</Button>

// v1.1.0 - new 'size' prop added
<Button variant="primary" size="lg">Click</Button>
```

### PATCH (Bug Fix)

```diff
// v1.1.0 - button had wrong padding
.btn { padding: 8px 12px; }

// v1.1.1 - fixed padding
.btn { padding: 0.5rem 1rem; }
```

## Pre-release Versions

Use pre-release tags for testing:

```
1.0.0-alpha.1   # Early development
1.0.0-beta.1    # Feature complete, testing
1.0.0-rc.1      # Release candidate
```

Publishing pre-releases:

```bash
npm version 1.0.0-beta.1
npm publish --tag beta
```

Installing pre-releases:

```bash
npm install @myorg/vue-components@beta
# or specific version
npm install @myorg/vue-components@1.0.0-beta.1
```

## Version Ranges for Consumers

Consumers should use appropriate version ranges:

```json
{
  "dependencies": {
    "@myorg/vue-components": "^1.0.0"
  }
}
```

| Range | Meaning | Updates |
|-------|---------|---------|
| `^1.0.0` | Compatible with 1.x.x | 1.0.0 → 1.9.9 |
| `~1.0.0` | Patch releases only | 1.0.0 → 1.0.9 |
| `1.0.0` | Exact version | Only 1.0.0 |

## Maintaining a CHANGELOG

Keep a `CHANGELOG.md` in your project:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New `Alert` component

## [1.1.0] - 2024-01-15

### Added
- Added `size` prop to Button component
- New `Tooltip` component

### Fixed
- Fixed Card hover animation on Safari

## [1.0.0] - 2024-01-01

### Added
- Initial release
- Button component
- Card component
```

### Automation with standard-version

Install:

```bash
npm install -D standard-version
```

Add script:

```json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

Commit with [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add Tooltip component"
git commit -m "fix: card hover animation on Safari"
git commit -m "BREAKING CHANGE: rename color prop to variant"
```

Run release:

```bash
npm run release        # Auto-determine version
npm run release -- --release-as minor  # Force minor
```

## Deprecation Strategy

When deprecating features:

### 1. Mark as Deprecated (MINOR)

```vue
<script setup lang="ts">
const props = defineProps<{
  /** @deprecated Use `variant` instead. Will be removed in v2.0 */
  color?: string
  variant?: string
}>()

if (props.color) {
  console.warn(
    '[@myorg/vue-components] Button: "color" prop is deprecated. Use "variant" instead.'
  )
}
</script>
```

### 2. Document in CHANGELOG

```markdown
### Deprecated
- `Button`: `color` prop deprecated in favor of `variant`
```

### 3. Remove in Next MAJOR

In version 2.0.0, remove the deprecated prop.

## Version Lifecycle

```
0.x.x        → Development (anything can change)
1.0.0-beta.1 → Testing
1.0.0-rc.1   → Release candidate
1.0.0        → Stable release
1.0.1        → Patch (bug fixes)
1.1.0        → Minor (new features)
2.0.0        → Major (breaking changes)
```

## Best Practices

:::tip Do's
- ✅ Always use semantic versioning
- ✅ Document all changes in CHANGELOG
- ✅ Deprecate before removing
- ✅ Use pre-release tags for testing
- ✅ Tag releases in git
:::

:::caution Don'ts
- ❌ Don't make breaking changes in MINOR/PATCH
- ❌ Don't remove deprecated features without MAJOR bump
- ❌ Don't skip version numbers
- ❌ Don't publish untested versions as `latest`
:::

## Next Steps

Learn how to [install and use packages](/consuming/installing-packages) from your registry.
