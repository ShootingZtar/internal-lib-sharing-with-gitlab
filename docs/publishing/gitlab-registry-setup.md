# GitLab Registry Setup

Configure GitLab Package Registry to host your npm packages.

## Understanding GitLab Package Registry

GitLab provides a built-in npm registry that allows you to:

- Host private packages alongside your code
- Use existing GitLab authentication
- Scope packages to projects or groups
- Integrate with CI/CD pipelines

## Registry Scopes

GitLab supports two registry scopes:

| Scope | URL Pattern | Use Case |
|-------|-------------|----------|
| **Project** | `https://gitlab.com/api/v4/projects/{id}/packages/npm/` | Single project packages |
| **Group** | `https://gitlab.com/api/v4/groups/{id}/-/packages/npm/` | Multiple packages in a group |

:::tip Recommendation
Use **group-level** registry for organizations with multiple packages. It simplifies authentication and allows a single `.npmrc` configuration.
:::

## Finding Your Project/Group ID

### Via GitLab UI

1. Go to your project or group page
2. Look for the **Project ID** on the main page (below the project name)

### Via GitLab API

```bash
# For a project
curl --header "PRIVATE-TOKEN: <your-token>" \
  "https://gitlab.com/api/v4/projects?search=my-project"

# For a group
curl --header "PRIVATE-TOKEN: <your-token>" \
  "https://gitlab.com/api/v4/groups?search=my-group"
```

## Create a Personal Access Token

1. Go to **User Settings** → **Access Tokens**
2. Click **Add new token**
3. Configure the token:
   - **Token name**: `npm-publish` (or descriptive name)
   - **Expiration date**: Set appropriate expiration
   - **Scopes**: Select `api` or at minimum `read_api` and `write_registry`
4. Click **Create personal access token**
5. **Copy the token** - you won't see it again!

:::caution Security
Never commit tokens to your repository. Use environment variables or `.npmrc` files excluded from git.
:::

## Configure npm for GitLab

### Option 1: Project-level `.npmrc`

Create `.npmrc` in your project root:

```ini
# Replace YOUR_GROUP_ID with your actual group ID
@myorg:registry=https://gitlab.com/api/v4/groups/YOUR_GROUP_ID/-/packages/npm/

# Authentication (use environment variable)
//gitlab.com/api/v4/groups/YOUR_GROUP_ID/-/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
```

Add `.npmrc` to `.gitignore` if it contains tokens:

```gitignore
# Don't commit if it has hardcoded tokens
# .npmrc
```

### Option 2: User-level Configuration

Add to `~/.npmrc`:

```ini
# For all @myorg packages
@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=glpat-xxxxxxxxxxxx
```

### Option 3: Environment Variable

Set the token as an environment variable:

```bash
# In your shell profile (.bashrc, .zshrc)
export GITLAB_NPM_TOKEN="glpat-xxxxxxxxxxxx"
```

Then in `.npmrc`:

```ini
@myorg:registry=https://gitlab.com/api/v4/groups/12345/-/packages/npm/
//gitlab.com/api/v4/groups/12345/-/packages/npm/:_authToken=${GITLAB_NPM_TOKEN}
```

## Verify Configuration

Test that npm can access the registry:

```bash
# Should return empty array or existing packages
npm search --registry=https://gitlab.com/api/v4/groups/YOUR_GROUP_ID/-/packages/npm/ @myorg
```

## Troubleshooting

### 401 Unauthorized

```
npm ERR! 401 Unauthorized
```

**Solutions:**
- Verify your token is correct and not expired
- Check token scopes include `api` or `write_registry`
- Ensure the registry URL is correct

### 403 Forbidden

```
npm ERR! 403 Forbidden
```

**Solutions:**
- Verify you have permission to publish to this project/group
- Check if Package Registry is enabled for the project
- For self-hosted GitLab, verify npm registry is enabled

### 404 Not Found

```
npm ERR! 404 Not Found
```

**Solutions:**
- Double-check the group/project ID
- Verify the registry URL format
- Ensure the project/group exists and is accessible

## Next Steps

Now let's configure your [package for publishing](/publishing/package-configuration).
