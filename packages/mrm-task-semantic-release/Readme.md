# mrm-task-semantic-release

[Mrm](https://github.com/sapegin/mrm) task that adds [semantic-release](https://github.com/semantic-release/semantic-release).

## What it does

- Runs semantic-release on Travis CI
- Adds an npm version badge to the Readme
- Adds change log file to `.gitignore`

## Usage

```
npm install -g mrm mrm-task-semantic-release
mrm semantic-release
```

## Options

See [Mrm docs](https://github.com/sapegin/mrm#usage) for more details.

### `semanticConfig` (object, optional)

A semantic-release [config object](https://semantic-release.gitbooks.io/semantic-release/content/docs/usage/plugins.html#configuration), will be added to `package.json` as a `release` key.

### `semanticArgs` (string, optional)

Extra arguments for `semantic-release` command. For example `--analyze-commits semantic-release-tamia/analyzeCommits`.

### `semanticPeerDependencies` (array, optional)

Additional dependencies to install.

### `readmeFile` (default: `Readme.md`)

Name of the Readme file.

### `changelogFile` (default: `Changelog.md`)

Name of the change log file.

## Change log

The change log can be found in [Changelog.md](Changelog.md).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](../../Contributing.md).

## Authors and license

[Artem Sapegin](http://sapegin.me) and [contributors](https://github.com/sapegin/mrm-tasks/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
