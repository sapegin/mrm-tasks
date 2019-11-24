## 3.0.0

- Drop Node 6 support (Node 8.9 is the oldest supported version).
- Don't use travis-deploy-once, run semantic-release directly
- Don't create .gitignore (was needed only for custom Tâmia workflow)
- Support custom presets (`semanticPreset` option)

## 2.2.0

- Show complete authentication instructions instead of relying on `semantic-release-cli`, which doesn't work well with npm two-factor authentication.

## 2.1.1

- Update deps.

## 2.1.0

- Update CI command to use travis-deploy-once.

## 2.0.0

- Update to semantic-release 11.
- New option semanticArgs.

## 1.1.1

- Fix: Install peer dependencies locally.

## 1.1.0

- Add options for custom semantic-release config and extra dependencies.

## 1.0.0

Initial release.
