# CI/CD Automation

Automate building, testing, and publishing with GitLab CI/CD.

## Basic Pipeline

Create `.gitlab-ci.yml` in your project root:

```yaml
stages:
  - test
  - build
  - publish

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .npm/
    - node_modules/

# Install dependencies
.install: &install
  - npm ci

# Test stage
test:
  stage: test
  image: node:20
  script:
    - *install
    - npm run lint
    - npm run test
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# Build stage
build:
  stage: build
  image: node:20
  script:
    - *install
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  rules:
    - if: $CI_COMMIT_TAG

# Publish stage
publish:
  stage: publish
  image: node:20
  script:
    - *install
    - |
      echo "@myorg:registry=https://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/"
      echo "//${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}"
    - |
      echo "@myorg:registry=https://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/" >> .npmrc
      echo "//${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
    - npm publish
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+/
  needs:
    - build
```

## Tag-based Publishing

### Creating a Release

1. Update version in `package.json`
2. Commit the change
3. Create a git tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The pipeline will automatically publish when it detects a version tag.

### Automated Versioning

Use `semantic-release` for fully automated versioning:

```bash
npm install -D semantic-release @semantic-release/gitlab
```

Create `.releaserc.json`:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/gitlab"
  ]
}
```

Update pipeline:

```yaml
release:
  stage: publish
  image: node:20
  script:
    - *install
    - npx semantic-release
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

## Environment-specific Publishing

### Beta Releases

```yaml
publish-beta:
  stage: publish
  image: node:20
  script:
    - *install
    - npm run build
    - |
      echo "@myorg:registry=https://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/" >> .npmrc
      echo "//${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
    - npm publish --tag beta
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+-beta/
```

### Production Releases

```yaml
publish-latest:
  stage: publish
  image: node:20
  script:
    - *install
    - npm run build
    - |
      echo "@myorg:registry=https://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/" >> .npmrc
      echo "//${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
    - npm publish --tag latest
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
  environment:
    name: production
```

## Complete Pipeline Example

```yaml
stages:
  - validate
  - test
  - build
  - publish
  - notify

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"
  NODE_VERSION: "20"

default:
  image: node:${NODE_VERSION}
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - .npm/
      - node_modules/
  before_script:
    - npm ci --cache .npm --prefer-offline

# Validate stage
lint:
  stage: validate
  script:
    - npm run lint
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

type-check:
  stage: validate
  script:
    - npm run type-check
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# Test stage
unit-tests:
  stage: test
  script:
    - npm run test:unit -- --coverage
  coverage: /All files[^|]*\|[^|]*\s+([\d\.]+)/
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# Build stage
build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+/

# Publish stages
publish-beta:
  stage: publish
  script:
    - |
      echo "@myorg:registry=https://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/" >> .npmrc
      echo "//${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
    - npm publish --tag beta
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+-(alpha|beta|rc)/
  needs:
    - build

publish-latest:
  stage: publish
  script:
    - |
      echo "@myorg:registry=https://${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/" >> .npmrc
      echo "//${CI_SERVER_HOST}/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
    - npm publish
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
  needs:
    - build
  environment:
    name: production

# Notify stage
notify-success:
  stage: notify
  script:
    - echo "Package @myorg/vue-components@${CI_COMMIT_TAG} published successfully!"
    # Add Slack/Teams notification here
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+/
  needs:
    - job: publish-latest
      optional: true
    - job: publish-beta
      optional: true
```

## Best Practices

:::tip Do's
- ✅ Use `CI_JOB_TOKEN` for authentication
- ✅ Cache node_modules for faster builds
- ✅ Run tests before publishing
- ✅ Use semantic versioning tags
- ✅ Create artifacts for build outputs
:::

:::caution Don'ts
- ❌ Don't hardcode tokens in `.gitlab-ci.yml`
- ❌ Don't publish on every commit
- ❌ Don't skip tests for releases
- ❌ Don't forget to handle pre-release tags
:::

## Next Steps

Learn about [monorepo setups](/advanced/monorepo-setup) for managing multiple packages.
