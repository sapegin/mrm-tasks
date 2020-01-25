# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/sapegin/mrm-tasks/compare/mrm-task-eslint@2.0.0...mrm-task-eslint@2.0.1) (2020-01-25)


### Bug Fixes

* **eslint:** Remove incorrectly formatted node_modules from eslintignore file ([f831ace](https://github.com/sapegin/mrm-tasks/commit/f831ace3d1b64578e15c63b2b1069b678f2ea10a))





## 2.0.0

- Drop Node 6 support (Node 8.9 is the oldest supported version).

For TypeScript projects:

- Use @typescript-eslint/parser and @typescript-eslint/eslint-plugin
- Use eslint-config-prettier if a project uses Prettier

## 1.2.1

- Support arrays in `extends` config option

## 1.2.0

- Migrate `.eslintrc` to `.eslintrc.json`.
- Update deps.

## 1.1.3

- Fix incorrect custom extensions handling.

## 1.1.0

- Add `eslintObsoleteDependencies` option.

## 1.0.2

- Add `.eslintcache` to `.gitignore`.

## 1.0.1

- Fix: Correct `--ext` value for TypeScript.

## 1.0.0

Initial release.
