# Authentication

Different authentication methods for GitLab Package Registry.

## Authentication Methods

GitLab supports several authentication methods for npm:

| Method | Use Case | Scope |
|--------|----------|-------|
| Personal Access Token | Developer machines | Full access |
| Deploy Token | CI/CD, Read-only access | Project/Group |
| CI Job Token | GitLab CI/CD pipelines | Automatic |
| Group Access Token | Service accounts | Group-wide |

## Personal Access Token (PAT)

Best for: **Developer machines**

### Create Token

1. Go to **User Settings** → **Access Tokens**
2. Create token with scopes:
   - `read_api` - for installing packages
   - `write_registry` - for publishing (if needed)

### Configure

```ini
# ~/.npmrc
@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=glpat-xxxxxxxxxxxx
```

## Deploy Token

Best for: **CI/CD systems, read-only access**

### Create Token

1. Go to **Project/Group Settings** → **Repository** → **Deploy tokens**
2. Create token with scope: `read_package_registry`

### Configure

```ini
# .npmrc
@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=<deploy-token>
```

## CI Job Token

Best for: **GitLab CI/CD pipelines**

The `CI_JOB_TOKEN` is automatically available in GitLab CI and provides:
- Read access to packages in the same project
- Read access to packages in groups the project belongs to

### Configure in .gitlab-ci.yml

```yaml
before_script:
  - echo "@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/" >> .npmrc
  - echo "//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc

install:
  script:
    - npm ci
```

Or use environment variables:

```yaml
variables:
  NPM_CONFIG_@myorg:registry: "https://gitlab.com/api/v4/groups/12345/-/packages/npm/"

install:
  script:
    - npm ci
  before_script:
    - echo "//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
```

## Group Access Token

Best for: **Service accounts, automation**

### Create Token

1. Go to **Group Settings** → **Access Tokens**
2. Create token with:
   - Role: `Reporter` (read) or `Developer` (read/write)
   - Scopes: `read_api` and/or `write_registry`

### Configure

Same as Personal Access Token.

## Environment Variables

Keep tokens secure using environment variables:

### Local Development

```bash
# .zshrc / .bashrc
export GITLAB_NPM_TOKEN="glpat-xxxxxxxxxxxx"
```

### .npmrc Template

Create `.npmrc.template` (committed to git):

```ini
@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
```

Add `.npmrc` to `.gitignore`:

```gitignore
.npmrc
```

### Setup Script

Create `scripts/setup-npmrc.sh`:

```bash
#!/bin/bash
if [ -z "$GITLAB_NPM_TOKEN" ]; then
  echo "Error: GITLAB_NPM_TOKEN is not set"
  exit 1
fi

cp .npmrc.template .npmrc
echo "✅ .npmrc configured"
```

## Token Rotation

Regularly rotate tokens for security:

1. Create new token
2. Update configurations
3. Test access
4. Revoke old token

### Automated Token Expiration

Set expiration dates when creating tokens:

- Personal tokens: 30-90 days
- Deploy tokens: Consider longer for CI/CD stability
- Group tokens: Based on security requirements

## Troubleshooting Authentication

### Invalid Token Format

```
npm ERR! Unable to authenticate
```

Ensure token format is correct:
- Personal Access Token: `glpat-xxxxxxxxxxxx`
- Deploy Token: Plain string (no prefix)

### Token Scope Issues

```
npm ERR! 403 Forbidden
```

Check token has required scopes:
- Reading: `read_api` or `read_registry`
- Writing: `api` or `write_registry`

### Cross-Group Access

For accessing packages across multiple groups:

```ini
# .npmrc - multiple groups
@group-a:registry=https://gitlab.com/api/v4/groups/111/-/packages/npm/
@group-b:registry=https://gitlab.com/api/v4/groups/222/-/packages/npm/

//gitlab.com/api/v4/groups/111/-/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
//gitlab.com/api/v4/groups/222/-/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
```

## Next Steps

Learn how to [use the components](/consuming/using-components) in your Vue application.
