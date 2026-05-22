# Automation Test Store E2E

End-to-end tests for [Automation Test Store](https://automationteststore.com/) using **WebdriverIO 9 + Cucumber + TypeScript** with Allure reporting.

## Requirements

- Node.js `^20`
- Chrome (matching the version installed in CI / locally)

## Setup

```bash
npm install
cp .env.example .env
# edit .env and provide real credentials
```

## Running tests

```bash
npm test                 # run the full suite
npm run test:login       # run only the login feature
```

You can also filter by tag at the CLI:

```bash
npx wdio run wdio.conf.ts --cucumberOpts.tags="@smoke-testing"
npx wdio run wdio.conf.ts --cucumberOpts.tags="@negative"
```

## Quality checks

```bash
npm run typecheck        # TypeScript, no emit
npm run lint             # ESLint
npm run lint:fix         # ESLint with autofix
npm run format           # Prettier write
npm run format:check     # Prettier verify only
```

## Allure reports

After a test run:

```bash
npm run allure:report    # generate and open the report locally
```

Raw results land in `reports/allure-results`; the generated HTML report lands in `reports/allure-report`. Both directories are gitignored.

## Project layout

```
features/
  page-objects/   # Page Object classes (BasePage + per-page subclasses)
  specs/          # Gherkin .feature files
  step-definitions/  # Cucumber step bindings
  support/        # Shared helpers (allure-step, env, constants)
.github/workflows/  # CI workflow
wdio.conf.ts      # WebdriverIO configuration
tsconfig.json     # TypeScript configuration
eslint.config.js  # ESLint flat config
```

## Environment variables

| Variable             | Required | Purpose                                 |
| -------------------- | -------- | --------------------------------------- |
| `TEST_USER_USERNAME` | yes      | Username for the registered test user   |
| `TEST_USER_PASSWORD` | yes      | Password for the registered test user   |
| `BASE_URL`           | yes      | Base URL of the application under test. |

|

Local values live in `.env`. In CI, set them as repository secrets.

## CI

Tests run on every push and PR to `main` via [`.github/workflows/e2e-wdio.yml`](.github/workflows/e2e-wdio.yml). The workflow:

1. Installs dependencies with `npm ci`
2. Runs `npm run typecheck` and `npm run lint`
3. Runs `npm test`
4. Uploads Allure results and any failure screenshots as artifacts

Required GitHub repository secrets:

- `TEST_USER_USERNAME`
- `TEST_USER_PASSWORD`

## Conventions

- **Page objects** expose Chainable elements as private getters and use the typed helpers on `BasePage` (`click`, `fill`, `getText`, etc.).
- **Selectors**: prefer stable IDs / `data-test-id` attributes over link-text strategies.
- **Timeouts**: use `DEFAULT_TIMEOUT_MS` from `features/support/constants.ts`.
- **Environment access**: use `getEnv()` from `features/support/env.ts` — it throws if the variable is missing.
- **Assertions in steps**: wrap with `expectStep(description, () => expect(...))` so assertion outcomes show up as Allure steps.
