# mrm-task-lint-staged

[Mrm](https://github.com/sapegin/mrm) task that adds [lint-staged](https://github.com/okonet/lint-staged).

**Note:** supports only Prettier, ESLint and Stylelint now, pull requests are welcome.

## What it does

- Creates a config in `package.json`
- Sets up a pre-commit Git hook
- Installs dependencies

## Usage

```
npm install -g mrm mrm-task-lint-staged
mrm lint-staged
```

## Options

See [Mrm docs](https://github.com/sapegin/mrm#usage) and [lint-staged docs](https://github.com/okonet/lint-staged/blob/master/README.md) for more details.

### `lintStagedRules` (default: infer)

Custom rules. By default will try to infer by project dependencies.

### `eslintExtensions` (default: infer or `.js`)

File extensions to run ESLint on. By default will try to infer from your `lint` npm script or use `.js`.

### `prettierExtensions` (default: infer or `.js`)

File extensions to run Prettier on. By default will try to infer from your `format` npm script or use `.js`.

### `stylelintExtensions` (default: `.css`)

File extensions to run stylelint on.

## Change log

The change log can be found in [Changelog.md](Changelog.md).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](../../Contributing.md).

## Authors and license

[Artem Sapegin](http://sapegin.me) and [contributors](https://github.com/sapegin/mrm-tasks/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
