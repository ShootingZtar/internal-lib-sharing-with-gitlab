# Installing Packages

How to install packages from GitLab Package Registry in your projects.

## Configure npm to Use GitLab Registry

Before installing, configure npm to find your scoped packages.

### Project-level Configuration

Create `.npmrc` in your project root:

```ini
# Tell npm where to find @myorg packages
@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/

# Authentication
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
```

### User-level Configuration

Add to `~/.npmrc` for all projects:

```ini
@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=glpat-xxxxxxxxxxxx
```

## Install the Package

```bash
npm install @myorg/vue-components
```

Or with a specific version:

```bash
npm install @myorg/vue-components@1.2.0
```

Or with a tag:

```bash
npm install @myorg/vue-components@beta
```

## Verify Installation

Check that the package was installed:

```bash
npm list @myorg/vue-components
```

You should see:

```
my-project@1.0.0
└── @myorg/vue-components@1.0.0
```

## Using with Different Package Managers

### yarn

Create `.yarnrc.yml`:

```yaml
npmScopes:
  myorg:
    npmRegistryServer: "https://gitlab.com/api/v4/groups/12345/-/packages/npm/"
    npmAuthToken: "${GITLAB_NPM_TOKEN}"
```

Install:

```bash
yarn add @myorg/vue-components
```

### pnpm

Create `.npmrc`:

```ini
@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
```

Install:

```bash
pnpm add @myorg/vue-components
```

## Lockfile Considerations

After configuring the registry, your lockfile will reference GitLab URLs:

```json
// package-lock.json
{
  "packages": {
    "node_modules/@myorg/vue-components": {
      "version": "1.0.0",
      "resolved": "https://gitlab.com/api/v4/groups/12345/-/packages/npm/@myorg/vue-components/-/@myorg/vue-components-1.0.0.tgz",
      "integrity": "sha512-..."
    }
  }
}
```

## Updating Packages

Check for updates:

```bash
npm outdated @myorg/vue-components
```

Update to latest:

```bash
npm update @myorg/vue-components
```

Update to specific version:

```bash
npm install @myorg/vue-components@1.2.0
```

## Troubleshooting Installation

### 404 Not Found

```
npm ERR! 404 Not Found - GET https://gitlab.com/api/v4/...
```

**Solutions:**
- Verify the package exists in GitLab Package Registry
- Check the scope matches the registry configuration
- Ensure the version exists

### 401 Unauthorized

```
npm ERR! 401 Unauthorized
```

**Solutions:**
- Check your access token is set correctly
- Verify token hasn't expired
- Ensure token has `read_api` scope

### Authentication in CI/CD

For CI environments, set the token as an environment variable:

```yaml
# .gitlab-ci.yml
variables:
  GITLAB_NPM_TOKEN: ${CI_JOB_TOKEN}

install:
  script:
    - npm ci
```

The `CI_JOB_TOKEN` has automatic read access to group packages.

## Next Steps

Learn about [authentication options](/consuming/authentication) for different scenarios.
