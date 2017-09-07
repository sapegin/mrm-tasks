# mrm-task-license

[Mrm](https://github.com/sapegin/mrm) task that adds license file based on `license` field in `package.json`.

## What it does

* Creates a license file.

## Usage

```
npm install -g mrm mrm-task-license
mrm license
```

## Options

See [Mrm docs](https://github.com/sapegin/mrm#usage) for more details.

### `licenseFile` (default: `License.md`)

File name.

### `name` (default: will try to read from your npm or Git config)

Your name.

### `email` (default: will try to read from your npm or Git config)

Your email.

### `url` (default: will try to read from your npm or Git config)

Your site URL.

## Change log

The change log can be found in [Changelog.md](Changelog.md).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](../../Contributing.md).

## Authors and license

[Artem Sapegin](http://sapegin.me) and [contributors](https://github.com/sapegin/mrm-tasks/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
