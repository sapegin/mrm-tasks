# mrm-task-readme

[Mrm](https://github.com/sapegin/mrm) task that adds a Readme file.

## What it does

- Creates a Readme file

## Usage

```
npm install -g mrm mrm-task-readme
mrm readme
```

## Options

See [Mrm docs](https://github.com/sapegin/mrm#usage) for more details.

### `github` (default: extracted from `.git/config` file)

Your GitHub user name.

### `name` (default: will try to read from your npm or Git config)

Your name.

### `url` (default: will try to read from your npm or Git config)

Your site URL.

### `readmeFile` (default: `Readme.md`)

Name of the Readme file.

### `licenseFile` (default: `License.md`)

Name of the license file.

### `packageName` (default: `name` field in `package.json`)

Package name.

## Change log

The change log can be found in [Changelog.md](Changelog.md).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](../../Contributing.md).

## Authors and license

[Artem Sapegin](http://sapegin.me) and [contributors](https://github.com/sapegin/mrm-tasks/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
