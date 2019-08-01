## 1.12.0

### codecov

- Collecting test coverage on CI should respect pretest and posttest scripts

### jest

- Allow passing arguments via `test` script (like `npm test -- --coverage`).

## 1.11.1

### eslint

- Support arrays in `extends` config option

## 1.11.0

### semantic-release

- Show complete authentication instructions instead of relying on `semantic-release-cli`, which doesn't work well with npm two-factor authentication.

### contributing

- Tweak the template.

## 1.10.1

### lint-staged

- Use correct Husky hook name: `pre-commit` instead of `precommit`.

## 1.10.0

### lint-staged

- Support husky 1.0, automatically migrate old configs.

## 1.9.0

### eslint

- Remove legacy ESLint config, `.eslintrc`.

### all tasks

- Update deps.

## 1.8.2

### prettier

- Use double quotes to make it work on Windows.

## 1.8.1

### eslint

- Fix incorrect custom extensions handling.

## 1.6.0

### lint-staged

- Correct extensions inference.

### package

- New options: minNode, license.
- Update engines.node on second run.

### semantic-release

- Update to semantic-release 11.
- New option semanticArgs.

### travis

- New option: maxNode.

## 1.5.0

- Update tasks.

## 1.4.0

- New tasks: contributing, prettier.

## 1.3.1

### jest

- Don’t update `.npmignore` for private packages.
- Suggest to run jest-codemods via npx and with the --force switch.

## 1.3.0

### license

- Add Unlicense license (#7).

## 1.2.1

### editorconfig

- Add `root=true` flag.

## 1.2.0

### package

- Fix: Correct package name.

### readme

- Make package name required and configurable.

### semantic-release

- Fix: Install peer dependencies locally.

## 1.1.0

### eslint

- Fix: Correct `--ext` value for TypeScript.

### jest

- TypeScript support.
- More useful default template (for single-file projects).
- Fix: Keep default `testPathIgnorePatterns` value.

### semantic-release

- Add options for custom semantic-release config and extra dependencies.

## 1.0.1

Update mrm-task-jest and mrm-task-semantic-release.

## 1.0.0

Initial release.
